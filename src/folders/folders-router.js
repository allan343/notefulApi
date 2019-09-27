const express = require('express')
//const xss = require('xss')
const FoldersService = require('./folders-service')

const foldersRouter = express.Router()
const jsonParser = express.json()

const serializeFolder = folder => ({
  id: folder.id,
  name: folder.foldename,
})

foldersRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    FoldersService.getAllFolders(knexInstance)
      .then(articles => {
        res.json(articles.map(serializeFolder))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const {  name } = req.body
    var foldename = name
    const newFolder = {  foldename }
/*
    for (const [key, value] of Object.entries(newFolder))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
        //newFolder.author = author*/
    FoldersService.insertFolder(
      req.app.get('db'),
      newFolder
    )
      .then(folder => {
        console.log(folder)
        res
          .status(201)
         // .location(`/folders/${folder.id}`)
          .location(req.originalUrl + `/${folder.id}`)
          .json(serializeFolder(folder))
      })
      .catch(next)
  })

foldersRouter
  .route('/:folder_id')
  .all((req, res, next) => {
    FoldersService.getById(
      req.app.get('db'),
      req.params.folder_id
    )
      .then(folder => {
        if (!folder) {
          return res.status(404).json({
            error: { message: `Folder doesn't exist` }
          })
        }
        res.folder = folder
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeArticle(res.article))
  })
  .delete((req, res, next) => {
    FoldersService.deleteArticle(
      req.app.get('db'),
      req.params.article_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

   .patch(jsonParser, (req, res, next) => {
       const { title, content, style } = req.body
       const folderToUpdate = { title, content, style }
    

       const numberOfValues = Object.values(folderToUpdate).filter(Boolean).length
          if (numberOfValues === 0) {
            return res.status(400).json({
              error: {
                message: `Request body must contain either 'title', 'style' or 'content'`
              }
            })
          }
    
       FoldersService.updateArticle(
         req.app.get('db'),
         req.params.article_id,
         folderToUpdate
       )
         .then(numRowsAffected => {
           res.status(204).end()
         })
         .catch(next)
      })

module.exports = foldersRouter