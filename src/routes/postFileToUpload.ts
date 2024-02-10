
import { Router } from 'express';
import config from 'config';

import path from 'path';

import multer from 'multer';

export const router = Router();

const folderPathname = config.get<string>('folderPathname');

const uploadMiddleware = multer({
  storage: multer.diskStorage({
    destination: folderPathname,
    filename: function (req, file, callback) {

      const currPath = decodeURI(req.path)

      console.log(req.method, currPath);

      callback(null, path.join(currPath, file.originalname));
    }
  }),
  limits: {
    // fileSize: 1024 // upload limit: 1Ko
    // fileSize: 1024*1024 // upload limit: 1Mo
    // fileSize: 1024*1024*1024 // upload limit: 1Go
    fileSize: 1024*1024*1024*1024 // upload limit: 1To
  },
  fileFilter: (req, file, callback) => {
    console.log('file', file);

    // accept all
    callback(null, true);
  }
});

router.post(
  /.*/,
  // uploadMiddleware.single('my-files'),
  uploadMiddleware.array('my-files', 10),
  (req, res) => {
    console.log("success");
    res.redirect(req.path);
    // res.json({data: "success"})
  });

