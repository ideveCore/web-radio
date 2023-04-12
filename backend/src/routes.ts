import express from 'express';
import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import path from 'path';
import { create_user, find_user, add_favorites } from './bd';


const router = express.Router();
const service_account = path.join(__dirname, '/config', 'firebase-secret.json')
initializeApp({
  credential: cert(service_account),
})

const auth = getAuth();


router.get('/api/v1/test', async (request: express.Request, response: express.Response) => {
  try {
    return response.status(200).json({
      message: "API running..."
    })
  } catch (error) {
    return response.status(400).json({
      error: error,
      message: "Unexpected error!"
    })
  }
});

router.post('/api/v1/user-sync', async (request: express.Request, response: express.Response) => {
  try {
    const { uid } = request.body;

    if (!uid || uid === '') {
      return response.status(400).json({
        message: "Invalid user uid",
      })

    }
    auth.getUser(uid).then(async (user) => {
      await create_user(user.uid);
      const User = await find_user(user.uid);
      response.status(200).json({
        user: {
          uid: User?.uid,
          favorites: User?.favorites,
        }
      })
    }).catch((error) => {
      return response.status(400).json({
        error,
        message: "User not found!",
      })
    })
  } catch (error) {
    return response.status(400).json({
      error: error,
      message: "Unexpected error!"
    })
  }
})

router.post('/api/v1/favorites', async (request: express.Request, response: express.Response) => {
  try {
    const { station_id, uid } = request.body;

    auth.getUser(uid).then(async (user) => {
      await add_favorites(user.uid, station_id);
      const user_data = await find_user(user.uid);
      return response.status(200).json({
        user: {
          uid: user_data?.uid,
          favorites: user_data?.favorites,
        }
      })
    }).catch((error) => {
      return response.status(400).json({
        error,
        message: "User not found!",
      })
    })

  } catch (error) {
    return response.status(400).json({
      error: error,
      message: "Unexpected error!"
    })

  }
})


export default router;
