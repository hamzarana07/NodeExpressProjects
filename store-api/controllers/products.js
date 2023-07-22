const Product = require("../models/product");

const getAllProductsStatic = async (req, res) => {
    try {
        const search = "ab";
        const products = await Product.find({}).limit(4);
        res.status(200).json({ products, nbHits: products.length });
    } catch (error) {
        console.error(error);
    }
};
const getAllProducts = async (req, res) => {
    try {
        const { featured, company, name, sort, select, numericFilters } =
            req.query;
        const queryObject = {};
        if (featured) {
            if (featured === "true") {
                queryObject.featured = true;
            } else {
                queryObject.featured = false;
            }
        }
        if (company) {
            queryObject.company = company;
        }
        if (name) {
            queryObject.name = { $regex: name, $options: "i" };
        }

        if (numericFilters) {
            const operatorMap = {
                ">": "$gt",
                ">=": "$gte",
                "=": "$eq",
                "<": "$lt",
                "<=": "$lte",
            };
            const regEx = /\b(<|>|>=|=|<|<=)\b/g;
            let filters = numericFilters.replace(
                regEx,
                (match) => `-${operatorMap[match]}-`
            );
            const options = ["price", "rating"];
            filters = filters.split(",").forEach((item) => {
                const [select, operator, value] = item.split("-");
                if (options.includes(select)) {
                    queryObject[select] = { [operator]: Number(value) };
                }
            });
        }
        let result = Product.find(queryObject);
        if (sort) {
            // console.log(sort) - name
            // console.log(sort.split(",")) - ['name']
            const sortList = sort.split(",").join(" ");
            result = result.sort(sortList);
        } else {
            result = result.sort("createdAt");
        }
        if (select) {
            const selectList = select.split(",").join(" ");
            result = result.select(selectList);
        }

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        result = result.skip(skip).limit(limit);

        const products = await result;
        res.status(200).json({ products, count: products.length });
    } catch (error) {
        console.error(error);
    }
};

module.exports = {
    getAllProducts,
    getAllProductsStatic,
};
