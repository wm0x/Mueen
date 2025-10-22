import { db } from "@/lib/db";

//there in this file we find the user using his i or email

export const getUserById = async (id: string) => {
  try {
    console.log("Get user with ID : ", id);

    const user = await db.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        orders: true,
        role: true,
      },
    });

    // here if the user not found in db
    if (!user) {
      console.warn(`User not found with ID: ${id}`);
      return null;
    }

    //there if we find user in db return his info
    return user;
  } catch (error: any) {
    console.error("Error fetching user by ID:", error);
    if (error.code) {
      console.error(`Prisma Error Code: ${error.code}`);
    }
    throw new Error(`Database query failed: ${error.message}`);
  }
};


// here we will use email for search the user for login process 

export const getUserByEmail = async (email: string) => {
    try {
      const user = await db.user.findFirst({
        where: { email },
      });
      return user;
    } catch (error) {
      return null; 
    }
  };
  