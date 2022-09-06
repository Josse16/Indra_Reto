import supertest from 'supertest';
import * as handler from '../handlers';
//import { getProduct } from '../handlers';
import * as utils from '../../libs/utils';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

const documentClientMock = {
    get: jest.fn(),
    put: jest.fn(),
};

let spyParametersOn;

describe('Products', () => {
    beforeEach(() => {
        setSpys();
    });

    afterEach(() => {
        jest.resetAllMocks();
        //spyParametersOn.mockRestore();
    });

    it('testing  getProduct - OK', async () => {


        const event = {
            pathParameters: { productID: '913f5254-b790-4f3b-940e-c7dc48af715a' },
        } as unknown as APIGatewayProxyEvent;

        {
            dynamoGetMocks(productoMock);
        }

        const response = (await handler.getProduct(event)) as APIGatewayProxyResult;

        expect(documentClientMock.get).toHaveBeenCalledTimes(1);
        expect(response.statusCode).toBe(200);
    });

});

function setSpys(): void {
    spyParametersOn = jest.spyOn(utils, 'getVariable').mockImplementation((param) => {

        if (param.includes('DATABASE_TEXT_PARAMETERS')) {
            return 'patientportal-resources-database-textParameters-dev';
        }

        return '';
    });
}

function dynamoGetMocks(item: any): void {
    documentClientMock.get.mockImplementationOnce((param) => {
        return {
            promise(): Promise<unknown> {
                return Promise.resolve({
                    $response: {
                        data: 'DynamoDB.DocumentClient.get mocked successfully',
                    },
                    Item: item,
                });
            },
        };
    });
}

const productoMock = {
    description: "mobile phone",
    price: 1500,
    name: "Iphone 13",
    productID: "913f5254-b790-4f3b-940e-c7dc48af715a"
};