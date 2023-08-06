module.exports = (sequelize, Sequelize) => {
  const Article = sequelize.define(
    "articles",
    {
      article_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      link: {
        type: Sequelize.STRING(255),
        primaryKey: true,
        allowNull: false,
      },
      pubDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      author: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      contentSnippet: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      summary: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      country_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "rssLinks", // Assuming you have a table named "rssLinks" with "country_id" as the primary key
          key: "country_id",
        },
      },
    },
    {
      timestamps: false, // Disable createdAt and updatedAt columns
    }
  );
  return Article;
};
