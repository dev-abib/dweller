import { Test, TestingModule } from '@nestjs/testing';
import { Controller, Get, INestApplication } from '@nestjs/common';
import {
  buildSwaggerDocument,
  swaggerCustomOptions,
  SWAGGER_TITLE,
  SWAGGER_VERSION,
  ApiSuccessResponse,
  ApiPaginatedResponse,
  ApiSingleFileUpload,
  ApiAuthProtected,
} from './index';

class MockDto {
  name: string;
}

@Controller('test')
class TestController {
  @Get('endpoint')
  @ApiSuccessResponse({ type: MockDto })
  @ApiPaginatedResponse(MockDto)
  @ApiSingleFileUpload({ fieldName: 'file', bodyDto: MockDto })
  @ApiAuthProtected()
  testEndpoint() {
    return { name: 'test' };
  }
}

describe('Swagger Module', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [TestController],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('buildSwaggerDocument', () => {
    it('should generate an OpenAPI document with correct title and version', () => {
      const document = buildSwaggerDocument(app);

      expect(document).toBeDefined();
      expect(document.info.title).toBe(SWAGGER_TITLE);
      expect(document.info.version).toBe(SWAGGER_VERSION);
      expect(document.components?.securitySchemes).toHaveProperty('bearer');
    });
  });

  describe('swaggerCustomOptions', () => {
    it('should have custom UI settings enabled', () => {
      expect(swaggerCustomOptions.customSiteTitle).toBe('Q-Studieon API Docs');
      expect(swaggerCustomOptions.customCss).toBeDefined();
      expect(swaggerCustomOptions.customJsStr).toBeDefined();
      expect(swaggerCustomOptions.swaggerOptions).toMatchObject({
        persistAuthorization: true,
        tryItOutEnabled: true,
      });
    });
  });

  describe('Swagger Decorators', () => {
    it('should decorate endpoints without throwing errors', () => {
      const controller = new TestController();
      expect(controller.testEndpoint()).toEqual({ name: 'test' });
    });
  });
});
