import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const find_user = async (uid: string) => {
  return await prisma.users.findUnique({
    where: {
      uid,
    },
    include: {
      favorites: true,
    }
  })
};

export const find_favorite = async (uid: string, station_id: string) => {
  return await prisma.users.findUnique({
    where: {
      uid,
    },
    include: {
      favorites: {
        where: {
          station_id,
        }
      }
    }
  })
};

export const create_user = async (uid: string) => {
  if(!(await find_user(uid))) {
    return await prisma.users.create({
      data: {
        uid,
      }
    })
  }
};

export const add_favorites = async (uid: string, station_id: string) => {
  await find_favorite(uid, station_id).then(async (response: any) => {
    if(response.favorites.length > 0) {
      return await prisma.favorites.delete({
        where: {
          id: response.favorites[0].id
        }
      })
    }
    return await prisma.users.update({
      where: {
        uid,
      },
      data: {
        favorites: {
          create: {
            station_id,
          }
        }
      }
    })
  })
}
