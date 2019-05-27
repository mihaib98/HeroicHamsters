import express from 'express';
import Controller from './Controller';

import HttpStatus from '../utils/HttpStatus';

import StockRepository from '../repositories/StockRepository';
import NodeRepository from '../repositories/NodeRepository';
import RequestRepository from '../repositories/RequestRepository';
import MessageRepository from '../repositories/MessageRepository';

class AdminController implements Controller {
    public rootPath = '/admin';
    public router = express.Router();

    constructor() {
        this.initRoutes();
    }

    private initRoutes(): void {
        this.router.get(`${this.rootPath}/locations/:locationId`, this.getLocation.bind(this));

        this.router.get(`${this.rootPath}/requests/all`, this.getAllRequests.bind(this));

        this.router.post(`${this.rootPath}/stock/add`, this.addStockItem.bind(this));
        this.router.post(`${this.rootPath}/stock/edit/:stockItemId`, this.editStockItem.bind(this));

        this.router.get(`${this.rootPath}/messages/all`, this.getAllMessages.bind(this));
        this.router.get(`${this.rootPath}/messages/filters`, this.getMessagesByFilters.bind(this));
        this.router.delete(`${this.rootPath}/messages/filters`, this.deleteMessagesByFilters.bind(this));
    }

    /* Route for getting location structure */
    private getLocation(req: express.Request, res: express.Response): void {
        let locationId = req.params.locationId;

        NodeRepository.getInstance()
            .getLocationNode(locationId)
            .then(location => {
                res.status(HttpStatus.OK).json(location);
            })
            .catch(() => {
                res.status(HttpStatus.BadRequest).send();
            });
    }

    /* Route for getting all the requests */
    private getAllRequests(req: express.Request, res: express.Response): void {
        RequestRepository.getInstance()
            .getAll()
            .then(requests => {
                if (requests.length == 0) res.status(HttpStatus.NoContent).send();
                else res.status(HttpStatus.OK).json(requests);
            })
            .catch(() => {
                res.status(HttpStatus.BadRequest).send();
            });
    }

    /* Route for refilling a stock item */
    private addStockItem(req: express.Request, res: express.Response): void {
        const document = req.body;

        StockRepository.getInstance()
            .add(document)
            .then(stockItem => {
                res.status(HttpStatus.OK).json(stockItem);
            })
            .catch(() => {
                res.status(HttpStatus.BadRequest).send();
            });
    }

    /* Route for editing a stock item */
    private editStockItem(req: express.Request, res: express.Response): void {
        const document = req.body;
        const stockItemId = req.params.stockItemId;

        StockRepository.getInstance()
            .update(stockItemId, document)
            .then(stockItem => {
                res.status(HttpStatus.OK).json(stockItem);
            })
            .catch(() => {
                res.status(HttpStatus.BadRequest).send();
            });
    }

    /* Route for getting all the messages */
    private getAllMessages(req: express.Request, res: express.Response): void {
        MessageRepository.getInstance()
            .getAll()
            .then(messages => {
                if (messages.length == 0) res.status(HttpStatus.NoContent).send();
                else res.status(HttpStatus.OK).json(messages);
            })
            .catch(() => {
                res.status(HttpStatus.BadRequest).send();
            });
    }

    /* Route for getting messages by filters */
    private getMessagesByFilters(req: express.Request, res: express.Response): void {
        const filters = req.body;

        MessageRepository.getInstance()
            .getByFilters(filters)
            .then(messages => {
                if (messages.length == 0) res.status(HttpStatus.NoContent).send();
                else res.status(HttpStatus.OK).json(messages);
            })
            .catch(() => {
                res.status(HttpStatus.BadRequest).send();
            });
    }

    /* Route for deleting messages */
    private deleteMessagesByFilters(req: express.Request, res: express.Response): void {
        const filters = req.body;

        MessageRepository.getInstance()
            .deleteByFilters(filters)
            .then(() => res.status(HttpStatus.OK).send())
            .catch(() => {
                res.status(HttpStatus.BadRequest).send();
            });
    }
}

export default AdminController;
