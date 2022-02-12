import { Request, Response } from 'express';
import companyService from './company.service';
import generateMessage from '../common/common.message';
import coverage from '../common/coverage';
import { httpStatus } from '../common/coverage';
import logger from '../common/logger';

class companyCtrl {

        async listCompanies(req: Request, res: Response) {
                const list = await companyService.list();
                list.length == 0 ? res.status(httpStatus.NOT_FOUND)
                        .send(generateMessage.validation(coverage.EMPTY, coverage.FAILED, httpStatus.NOT_FOUND))
                        : res.status(httpStatus.OK).send(list);
        }

        async getCompaniesById(req: Request, res: Response) {
                const list = await companyService.readById(req.params.id);
                list == null ? res.status(httpStatus.NOT_FOUND)
                        .send(generateMessage.validation(coverage.NOT_EXISTS+coverage.COMPANY, coverage.FAILED, httpStatus.NOT_FOUND)) :
                        res.status(httpStatus.OK)
                                .send(generateMessage.validation(list, coverage.OK, httpStatus.OK));
        }

        async createCompany(req: Request, res: Response) {
                try {
                        const companyId = await companyService.create(req.body);
                        res.status(httpStatus.CREATE).send({
                                "Id": companyId,
                                "message": coverage.COMPANY + coverage.SUCCESS,
                                "status": coverage.OK,
                                "statusCode": httpStatus.CREATE
                        });
                }
                catch (e: any) {
                        let errObj = e.errors;
                        let errorMsg = "";
                        for (let i in errObj) { errorMsg += errObj[i].message + ", "; }
                        errorMsg = errorMsg.substring(0, errorMsg.length - 2);
                        logger.logger.error('from CREATE ', e);
                        res.status(httpStatus.ERROR)
                                .send(generateMessage.validation(errorMsg, coverage.FAILED, httpStatus.ERROR))
                }
        }

        async updateById(req: Request, res: Response) {
                const list = await companyService.readById(req.params.id);
                if (list === null) { res.status(httpStatus.NOT_FOUND).send({ message: coverage.NOT_EXISTS +coverage.COMPANY}) }
                else {
                        try {
                                await companyService.updateById(req.params.id, req.body);
                                res
                                        .status(httpStatus.OK)
                                        .send(generateMessage.validation(coverage.COMPANY+coverage.UPDATED, coverage.OK, httpStatus.OK));
                        }
                        catch (e: any) {
                                logger.logger.error('from UPDATE', e);
                                let errorMsg = "";
                                if (e.code && e.code === 11000) {
                                        let key = Object.keys(e.keyValue)[0];
                                        errorMsg = key + coverage.KEY_EXISTS;
                                }
                                res
                                        .status(httpStatus.ERROR)
                                        .send(generateMessage.validation(errorMsg, coverage.FAILED, httpStatus.ERROR));
                                logger.logger.error(e);
                        }
                }
        }

        async deleteById(req: Request, res: Response) {
                const list = await companyService.readById(req.params.id);
                if (list === null) { res.status(httpStatus.NOT_FOUND).send({ message: coverage.NOT_EXISTS +coverage.COMPANY}) }
                else {
                        const list = await companyService.readById(req.params.id);
                        list === null ? res.status(httpStatus.NOT_FOUND).send({ message: coverage.NOT_EXISTS+coverage.COMPANY })
                                : await companyService.deleteById(req.params.id),
                                res
                                        .status(httpStatus.OK)
                                        .send(generateMessage.validation(coverage.COMPANY+coverage.DELETED, coverage.SUCCESS, httpStatus.OK))
                }
        }

}
export default new companyCtrl();