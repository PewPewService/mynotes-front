module.exports = {
    css: {
      loaderOptions: {
        sass: {
          additionalData: `
            @import "~@/styles/_variables.scss"
            @import "~@/styles/global.scss"
          `
        },
        scss: {
          additionalData: `
            @import "~@/styles/_variables.scss";
            @import "~@/styles/global.scss";
          `
        },
      }
    }
  };