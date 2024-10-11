import { ProductModule } from './product/product.module';
import { ProductService } from './product/product.service';
import { CollectionModule } from './collection/collection.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ArticleModule } from './article/article.module';
import { PrismaService } from './prisma/prisma.service';
import { MailModule } from './mail/mail.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { GeneratePdfModule } from './generate-pdf/generate-pdf.module';
import { AuthService } from './auth/auth.service';
import { ProductDetailModule } from './src/product-detail/product-detail.module';
import { TestttModule } from './testtt/testtt.module';
import { TesttttController } from './testttt/testttt.controller';
import { SourcingSiteModule } from './sourcing-site/sourcing-site.module';
import { NotificationModule } from './notification/notification.module';
import { BoardModule } from './board/board.module';
import { PostModule } from './post/post.module';
import { ExchangeRateModule } from './exchange-rate/exchange-rate.module';
import { BannedProductCodeTemplateModule } from './banned-product-code-template/banned-product-code-template.module';
import { BannedProductCodeTemplateModule } from './exchange-rate/banned-product-code-template/banned-product-code-template.module';
import { ImageTemplateModule } from './image-template/image-template.module';
import { ShippingTemplateModule } from './shipping-template/shipping-template.module';
import { TranslationApiKeyModule } from './translation-api-key/translation-api-key.module';
import { TranslationSiteModule } from './translation-site/translation-site.module';
import { MarketUploadHistoryModule } from './market-upload-history/market-upload-history.module';
import { MarginTemplateModule } from './margin-template/margin-template.module';
import { UserProductCategoryMappingModule } from './user-product-category-mapping/user-product-category-mapping.module';
import { MarketCategoryModule } from './market-category/market-category.module';
import { MarketSettingsModule } from './market-settings/market-settings.module';
import { MarketUploadModule } from './market-upload/market-upload.module';
import { MarketApiKeyModule } from './market-api-key/market-api-key.module';
import { StoreModule } from './store/store.module';
import { MarketModule } from './market/market.module';
import { MarketService } from './market/market.service';
import { MarketController } from './market/market.controller';
import { UserProductDetailModule } from './user-product-detail/user-product-detail.module';
import { ProductCollectionModule } from './product-collection/product-collection.module';
import { ProductOptionModule } from './product-option/product-option.module';
import { ProductDetailModule } from './product-detail/product-detail.module';
import { ProductDetailModule } from './src/product-detail/product-detail.module';

@Module({
  imports: [
    ProductModule,
    CollectionModule,
    ConfigModule.forRoot({
      isGlobal: true, // no need to import into other modules
    }),
    MailerModule.forRootAsync({
      // transport: 'smtps://user@example.com:topsecret@smtp.example.com',
      // or
      useFactory: async (config: ConfigService) => ({
        // transport: config.get("MAIL_TRANSPORT"),
        // or
        transport: {
          host: config.get('MAIL_HOST'),
          secure: false,
          auth: {
            user: config.get('MAIL_USER'),
            pass: config.get('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: `"No Reply" <${config.get('MAIL_FROM')}>`,
        },
        template: {
          dir: `${__dirname}/../templates`,
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    ArticleModule,
    PrismaModule,
    MailModule,
    UserModule,
    AuthModule,
    GeneratePdfModule,
    ProductDetailModule,
    ProductOptionModule,
    ProductCollectionModule,
    UserProductDetailModule,
    MarketModule,
    StoreModule,
    MarketApiKeyModule,
    MarketUploadModule,
    MarketSettingsModule,
    MarketCategoryModule,
    UserProductCategoryMappingModule,
    MarginTemplateModule,
    MarketUploadHistoryModule,
    TranslationSiteModule,
    TranslationApiKeyModule,
    ShippingTemplateModule,
    ImageTemplateModule,
    BannedProductCodeTemplateModule,
    ExchangeRateModule,
    PostModule,
    BoardModule,
    NotificationModule,
    SourcingSiteModule,
    TestttModule,
  ],
  controllers: [AppController, MarketController, TesttttController],
  providers: [ProductService, AppService, PrismaService, AuthService, MarketService],
})
export class AppModule {}
