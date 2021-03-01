module.exports = function (queryManager) {
  const mainQuery ="SELECT id,title,description,created_date,modified_date FROM products";
  return {
    async getProductById(productId) {
      const {
        rows,
      } = await queryManager.query(
        `${mainQuery} where id = $1`,
        [productId]
      );
      return (rows || [])[0];
    },

    async getAllProducts(pageIndex = 0, pageSize) {
      let productRows = [];
      if (pageSize) {
        productRows = (
          await queryManager.query(`${mainQuery}  OFFSET $1 LIMIT $2`, [
            pageIndex * pageSize,
            pageSize,
          ])
        ).rows;
      } else {
        productRows = (await queryManager.query(mainQuery)).rows;
      }
      const { rows } = await queryManager.query(
        "SELECT COUNT(1) AS totalCount FROM PRODUCTS;"
      );

      const result = {
        totalCount: +rows[0]["totalcount"],
        products: productRows.map((r) => ({
          id: r.id,
          title: r.title,
          description: r.description,
          createdDate: r.createdDate,
          modifiedDate: r.modifiedDate,
        })),
      };

      return result;
    },

    async createProduct(product) {
      product.createdDate = new Date().toUTCString();
      product.modifiedDate = new Date().toUTCString();
      const res = await queryManager.query(
        `INSERT INTO 
                                            PRODUCTS(title,description,created_date,modified_date) 
                                            values($1,$2,$3,$4) Returning id`,
        [
          product.title,
          product.description,
          product.createdDate,
          product.modifiedDate,
        ]
      );
      product.id = res.rows[0].id;
      return product;
    },
    async deleteProduct(productId) {
      await queryManager.query(`DELETE FROM Products WHERE id = $1`, [productId]);
    },
    async updateProduct(productId, toBeUpdatedProduct) {
      toBeUpdatedProduct.modifiedDate = new Date().toUTCString();
      await queryManager.query(
        `Update Products SET title=$2, description=$3, modified_date=$4 WHERE id = $1`,
        [
          productId,
          toBeUpdatedProduct.title,
          toBeUpdatedProduct.description,
          toBeUpdatedProduct.modifiedDate,
        ]
      );
      return toBeUpdatedProduct;
    },
  };
};
