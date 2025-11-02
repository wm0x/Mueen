import { db } from "@/lib/db";

// here we got the user from db
export const getUserById = async (id: string) => {
  try {
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

    if (!user) {
      console.warn(`User not found with ID: ${id}`);
      return null;
    }

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
  