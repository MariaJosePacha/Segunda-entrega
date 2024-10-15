
import {Router} from "express"; 
const router = Router();
//Crear una vista "home.handlebars" la cual contenga una lista de todos los productos agregados hasta el momento
// Importamos el product manager y llamamos al metodo que corresponda 
import ProductManager from "../managers/product-manager.js";
const manager = new ProductManager("./src/data/productos.json");
router.get("/products", async(req, res)=> {
    const productos = await manager.getProducts();
    //Aqui se recupero los productos del JSON y se los envia a la vista "home"

    res.render("home",{productos});
    //Estamos renderizando la vista "home" y se esta enviando un array con todos los products del inventario 
    

})

//Además, crear una vista “realTimeProducts.handlebars”, la cual estará en la ruta “/realtimeproducts” en nuestro views router, ésta contendrá la misma lista de productos, sin embargo, ésta trabajará sólo con websockets
//router.get("/realtimeproducts", async(req, res )=>{
   // res.render("realtimeproducts");
    
//})

router.get("/realtimeproducts", async (req, res) => {
    const productos = await manager.getProducts();
    // Renderizar la vista "realtimeproducts" con los productos actuales
    res.render("realtimeproducts", { productos });
});

export default router;




