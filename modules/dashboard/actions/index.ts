"use server";
import { currentUser } from "@/modules/auth/actions";
import { db } from "@/lib/db";

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
        // Starmark: {
        //   where: {
        //     userId: user?.id!,
        //   },
        //   select: {
        //     isMarked: true,
        //   },
        // },
      },
    });

    return playground;
  } catch (error) {
    console.log(error);
  }
};
