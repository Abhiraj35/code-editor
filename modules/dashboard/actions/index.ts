"use server";
import { currentUser } from "@/modules/auth/actions";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const toggleStarMarked = async (playgroundId: string, isChecked: boolean) => {
  const user = await currentUser();

  const userId = user?.id;
  if(!userId){
    throw new Error("User Id is Required")
  }

  try {
    if(isChecked){
      await db.starMark.create({
        data: {
          userId: userId,
          playgroundId,
          isMarked: isChecked
        }
      })
    }else{
      await db.starMark.delete({
        where: {
          userId_playgroundId: {
            userId,
            playgroundId: playgroundId
          }
        }
      })
    }

    revalidatePath("/dashboard");
    return {success: true, isMarked: isChecked};
  } catch (error) {
    return {success: false, error: "failed to update",isChecked: isChecked};
  }
}

export const getAllPlaygroundForUser = async () => {
  const user = await currentUser();

  //before making db call make sure user is unauthenticated
  if(!user?.id){
    return [];
  }

  try {
    const playground = await db.playground.findMany({
      where: {
        userId: user.id,
      },
      include: {
        user: true,
        Starmark: {
          where: {
            userId: user.id,
          },
          select: {
            isMarked: true,
          },
        },
      },
    });

    return playground;
  } catch (error) {
    console.log(error);
  }
};

export const createPlayground = async(data:{
  title: string;
  template: "REACT" | "NEXTJS" | "EXPRESS" | "VUE" | "HONO" | "ANGULAR";
  description?: string;
}) => {
  const user = await currentUser();

  if(!user?.id){
    return { error: "User not authenticated"};
  }

  const {template, title, description} = data;

  try {
    const playground = await db.playground.create({
      data: {
        title:title,
        description: description,
        template: template,
        userId: user.id
      }
    })

    return playground;
  } catch (error) {
    return { error: "Failed to create Playground" };
  }
}

export const deleteProjectById = async(id:string) => {
  const user = await currentUser();

  if(!user?.id) {
    return { error: "Not authenticated" }
  }

  try {
    await db.playground.delete({
      where:{
        id,
        userId: user.id  //to ensure user owns the playground
      }
    })

    //once i delete a playground i don't want to reload page to see the change, so to prevent this in next js we use this
    revalidatePath("/dashboard")
    return { success: true};
  } catch (error) {
    return { error: "Failed to delete Project" };
  }
}

export const editProjectById = async(id: string,data:{title:string,description:string}) => {
  
  const user = await currentUser();

  if(!user?.id) {
    return { error: "Not authenticated" }
  }

  try {
    await db.playground.update({
      where:{
        id,
        userId: user.id
      },
      data
    })

    revalidatePath("/dashboard");
    return { success: true};
  } catch (error) {
    return { success: false, error: "Failed to edit project" };
  }
}

export const duplicateProjectById = async(id: string) => {
  const user = await currentUser();

  if(!user?.id) {
    return { error: "Not authenticated" }
  }

  try {
    const originalPlayground = await db.playground.findUnique({
      where: {id,userId: user.id}
      //TODO: add template file
    })

    if(!originalPlayground){
      return {error: "Playground not found or access denied"};
    }

    const duplicatedPlayground = await db.playground.create({
      data:{
        title: `${originalPlayground.title} (Copy)`,
        description: originalPlayground.description,
        template: originalPlayground.template,
        userId: user.id,

        //TODO: add template files
      }
    })

    revalidatePath("/dashboard");
  
    return duplicatedPlayground;
  } catch (error) {
    return { error: "Failed to duplicate project" };
  }
}