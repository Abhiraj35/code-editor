"use server";
import { currentUser } from "@/modules/auth/actions";
import { db } from "@/lib/db";
import { toast } from "sonner";
import { revalidatePath } from "next/cache";
import { exportTraceState } from "next/dist/trace";
import { AwardIcon } from "lucide-react";

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
          userId: userId!,
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
    return {success: false, error: "failed to update"};
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
            userId: user?.id!,
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

  const {template, title, description} = data;

  try {
    const playground = db.playground.create({
      data: {
        title:title,
        description: description,
        template: template,
        userId: user?.id!
      }
    })

    return playground;
  } catch (error) {
    toast.error("Failed to create Playground");
  }
}

export const deleteProjectById = async(id:string) => {
  try {
    await db.playground.delete({
      where:{
        id
      }
    })

    //once i delete a playground i don't want to reload page to see the change, so to prevent this in next js we use this
    revalidatePath("/dashboard")
  } catch (error) {
    toast.error("Failed to delete Project")
  }
}

export const editProjectById = async(id: string,data:{title:string,description:string}) => {
  try {
    await db.playground.update({
      where:{
        id
      },
      data
    })

    revalidatePath("/dashboard");
  } catch (error) {
    toast.error("Failed to edit");
  }
}

export const duplicateProjectById = async(id: string) => {
  try {
    const originalPlayground = await db.playground.findUnique({
      where: {id}
      //TODO: add templete file
    })

    if(!originalPlayground){
      throw new Error("Original playground not found");
    }

    const duplicatedPlayground = await db.playground.create({
      data:{
        title: `${originalPlayground.title} (Copy)`,
        description: originalPlayground.description,
        template: originalPlayground.template,
        userId: originalPlayground.userId,

        //TODO: add template files
      }
    })

    revalidatePath("/dashboard");
  
    return duplicatedPlayground;
  } catch (error) {
    toast.error("Failed to duplicate project")
  }
}