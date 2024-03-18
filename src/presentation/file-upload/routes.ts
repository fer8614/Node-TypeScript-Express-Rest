import { Router } from 'express';
import { FileUploadController } from './controller';
import { FileUploadService } from '../services/file-uplaod.service';
import { FileUploadMiddleware } from '../middlewares/file-upload.middleware';
import { TypeMiddleware } from '../middlewares/type.middleware';




export class FileUploadRoutes {


  static get routes(): Router {

    const router = Router();
    const controller = new FileUploadController( 
      new FileUploadService()
    );
    
    router.use( FileUploadMiddleware.containsFile );
    router.use( TypeMiddleware.validTypes( [ 'users', 'categories', 'products' ] ) );
    // Define routes
    //api/upload/single/<user|category|product>/
    //api/upload/multiple/<user|category|product>/
    router.post( '/single/:type', controller.uploadFile );
    router.post( '/multiple/:type', controller.uploadMultipleFiles );

    return router;
  }


}

