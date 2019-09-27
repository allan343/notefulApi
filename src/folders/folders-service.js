const FoldersService = {
  getAllFolders(knex) {
    return knex.select('*').from('noteful_folders')
  },
  insertFolder(knex, newArticle) {
    return knex
      .insert(newArticle)
      .into('noteful_folders')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },
  getById(knex, id) {
    return knex.from('noteful_folders').select('*').where('id', id).first()
  },
  deleteFolder(knex, id) {
    return knex('noteful_folders')
      .where({ id })
      .delete()
  },
  updateFolder(knex, id, newArticleFields) {
    return knex('noteful_folders')
      .where({ id })
      .update(newArticleFields)
  },
}

module.exports = FoldersService