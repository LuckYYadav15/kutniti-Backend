module.exports = (sequelize, Sequelize) => {
  const CountryCount = sequelize.define(
    "countryCount",
    {
      countryName: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      type: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      flagLogo: {
        type: Sequelize.STRING(255),
        primaryKey: true,
      },
      Articles: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    { timestamps: false }
  );

  return CountryCount;
};


// aws sdk -> s3
// 