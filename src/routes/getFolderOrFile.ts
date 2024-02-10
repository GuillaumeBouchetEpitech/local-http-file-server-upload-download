
import { Router, Request, Response } from 'express';
import config from 'config';

import fs from 'fs';
import path from 'path';

import ejs from 'ejs';

const folderPathname = config.get<string>('folderPathname');

const cwd = process.cwd();
const templateContent = fs.readFileSync(path.resolve(cwd, 'pages', 'template.html'), 'utf8');

const k_rootPath = path.resolve(cwd, folderPathname);

export const router = Router();

const _replyFolderContent = (
  req: Request,
  res: Response,
  currPath: string,
  splittedPath: string[],
) => {

  const isRoot = (splittedPath.length === 0);
  const currFolder = isRoot ? '/' : `/${splittedPath.join("/")}`;

  let folderPath = k_rootPath;
  if (!isRoot) {
    folderPath = path.join(folderPath, ...splittedPath);
  }

  const _getUrl = (name: string): string => {
    return !isRoot ? `${currFolder}/${name}` : name;
  }

  const content = fs.readdirSync(folderPath, { withFileTypes: true });

  interface ITemplateData {
    host?: string;
    currFolder: string;
    currPath: string;
    isRoot: boolean;
    allFolders: { url: string, name: string, action: string }[];
    allFiles: { url: string; name: string, mtime: string }[],
    parentFolder?: { url: string, name: string, action: string };
  };


  const { allFolders, allFiles } = content.reduce<Pick<ITemplateData, 'allFolders' | 'allFiles'>>((acc, dirent) => {

    if (dirent.isDirectory()) {
      acc.allFolders.push({ url: _getUrl(dirent.name), name: dirent.name, action: 'GO TO' });
    } else {
      const fileStats = fs.statSync(path.join(folderPath, dirent.name));
      const mtime = `${fileStats.mtime.toDateString()} ${fileStats.mtime.getHours()}:${fileStats.mtime.getMinutes()}:${fileStats.mtime.getSeconds()}`;
      acc.allFiles.push({ url: _getUrl(dirent.name), name: dirent.name, mtime });
    }

    return acc;

  }, { allFolders: [], allFiles: [] });

  const templateData: ITemplateData = {
    host: req.headers.host,
    currFolder,
    currPath,
    allFolders,
    allFiles,
    isRoot
  };

  if (!templateData.isRoot) {
    templateData.parentFolder = { url: splittedPath.slice(0, splittedPath.length - 2).join("/"), name: "PREVIOUS FOLDER", action: 'GO BACK' }
  }

  const htmlCode = ejs.render(templateContent, templateData);

  res.setHeader('Content-type', "text/html");
  res.write(htmlCode);
  res.end();
};

// any get request
router.get(/.*/, (req, res) => {

  const currPath = decodeURI(req.path);

  const splittedPath = currPath.split("/").filter(item => item.length > 0);
  const filePath = path.resolve(k_rootPath, ...splittedPath);

  if (
    !fs.existsSync(filePath)
    || filePath.indexOf(k_rootPath) < 0
  ) {
    // console.log(' -> file does not exist');
    res.status(404);
    res.end();
    return;
  }

  // if it is a directory: list it's content
  const fileStats = fs.statSync(filePath);

  if (fileStats.isDirectory()) {
    _replyFolderContent(req, res, currPath, splittedPath);
    return;
  }

  // it's a file, start the download

  const filename = path.basename(filePath);

  res.setHeader('Content-disposition', 'attachment; filename=' + filename);
  res.setHeader('Content-type', "text/plain");
  // res.setHeader('Last-Modified', fileStats.mtime.toString());

  fs.createReadStream(filePath).pipe(res);
});
