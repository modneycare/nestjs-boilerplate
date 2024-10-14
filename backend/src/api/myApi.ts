/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface ResponseDto {
  data: object;
}

export interface EmailDTO {
  name: string;
  to: string;
  subject: string;
  verify?: string;
}

export interface UserDTO {
  name: string;
  phone: string;
  email: string;
  password: string;
  businessNumber: string;
  businessLicense: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponseDto {
  accessToken: object;
  refreshToken: object;
  user: object;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

export interface ResetPasswordReqDto {
  email: string;
}

export interface ResetPasswordDto {
  newPassword: string;
  resetPasswordToken: string;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, 'body' | 'bodyUsed'>;

export interface FullRequestParams extends Omit<RequestInit, 'body'> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, 'body' | 'method' | 'query' | 'path'>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, 'baseUrl' | 'cancelToken' | 'signal'>;
  securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = 'application/json',
  FormData = 'multipart/form-data',
  UrlEncoded = 'application/x-www-form-urlencoded',
  Text = 'text/plain',
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = '';
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>['securityWorker'];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: 'same-origin',
    headers: {},
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === 'number' ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join('&');
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => 'undefined' !== typeof query[key]);
    return keys
      .map((key) => (Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)))
      .join('&');
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : '';
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === 'object' || typeof input === 'string') ? JSON.stringify(input) : input,
    [ContentType.Text]: (input: any) => (input !== null && typeof input !== 'string' ? JSON.stringify(input) : input),
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === 'object' && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === 'boolean' ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(`${baseUrl || this.baseUrl || ''}${path}${queryString ? `?${queryString}` : ''}`, {
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? { 'Content-Type': type } : {}),
      },
      signal: (cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal) || null,
      body: typeof body === 'undefined' || body === null ? null : payloadFormatter(body),
    }).then(async (response) => {
      const r = response.clone() as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title LOG
 * @version 1.0
 * @contact
 *
 * cralwer server apis
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @name AppControllerGetHello
   * @request GET:/
   */
  appControllerGetHello = (params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/`,
      method: 'GET',
      ...params,
    });

  upload = {
    /**
     * No description
     *
     * @name AppControllerUploadFile
     * @summary Upload an image
     * @request POST:/upload
     * @secure
     */
    appControllerUploadFile: (
      data: {
        /** @format binary */
        file?: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<ResponseDto, any>({
        path: `/upload`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),
  };
  files = {
    /**
     * No description
     *
     * @name AppControllerSeeUploadedFile
     * @summary Visualize uploaded file
     * @request GET:/files/{filepath}
     * @secure
     */
    appControllerSeeUploadedFile: (filepath: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/files/${filepath}`,
        method: 'GET',
        secure: true,
        ...params,
      }),
  };
  products = {
    /**
     * No description
     *
     * @name ProductControllerCreate
     * @request POST:/products
     */
    productControllerCreate: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/products`,
        method: 'POST',
        ...params,
      }),

    /**
     * No description
     *
     * @name ProductControllerFindAll
     * @request GET:/products
     */
    productControllerFindAll: (
      query: {
        page: string;
        pageSize: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/products`,
        method: 'GET',
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @name ProductControllerFindOne
     * @request GET:/products/{id}
     */
    productControllerFindOne: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/products/${id}`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @name ProductControllerUpdate
     * @request PATCH:/products/{id}
     */
    productControllerUpdate: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/products/${id}`,
        method: 'PATCH',
        ...params,
      }),

    /**
     * No description
     *
     * @name ProductControllerRemove
     * @request DELETE:/products/{id}
     */
    productControllerRemove: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/products/${id}`,
        method: 'DELETE',
        ...params,
      }),
  };
  collections = {
    /**
     * No description
     *
     * @name CollectionControllerCreate
     * @request POST:/collections
     */
    collectionControllerCreate: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/collections`,
        method: 'POST',
        ...params,
      }),

    /**
     * No description
     *
     * @name CollectionControllerFindAll
     * @request GET:/collections
     */
    collectionControllerFindAll: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/collections`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @name CollectionControllerFindOne
     * @request GET:/collections/{id}
     */
    collectionControllerFindOne: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/collections/${id}`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @name CollectionControllerUpdate
     * @request PATCH:/collections/{id}
     */
    collectionControllerUpdate: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/collections/${id}`,
        method: 'PATCH',
        ...params,
      }),

    /**
     * No description
     *
     * @name CollectionControllerRemove
     * @request DELETE:/collections/{id}
     */
    collectionControllerRemove: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/collections/${id}`,
        method: 'DELETE',
        ...params,
      }),
  };
  article = {
    /**
     * No description
     *
     * @name ArticleControllerCreate
     * @request GET:/article
     */
    articleControllerCreate: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/article`,
        method: 'GET',
        ...params,
      }),
  };
  mail = {
    /**
     * No description
     *
     * @tags mail
     * @name MailControllerCreate
     * @request GET:/mail
     * @secure
     */
    mailControllerCreate: (data: EmailDTO, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/mail`,
        method: 'GET',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  user = {
    /**
     * No description
     *
     * @tags user
     * @name UserControllerCreate
     * @request POST:/user
     * @secure
     */
    userControllerCreate: (data: UserDTO, params: RequestParams = {}) =>
      this.request<ResponseDto, any>({
        path: `/user`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserControllerFindAll
     * @request GET:/user
     * @secure
     */
    userControllerFindAll: (params: RequestParams = {}) =>
      this.request<ResponseDto, any>({
        path: `/user`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserControllerFindOne
     * @request GET:/user/{id}
     * @secure
     */
    userControllerFindOne: (id: string, params: RequestParams = {}) =>
      this.request<ResponseDto, any>({
        path: `/user/${id}`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserControllerUpdate
     * @request PATCH:/user/{id}
     * @secure
     */
    userControllerUpdate: (id: string, data: UserDTO, params: RequestParams = {}) =>
      this.request<ResponseDto, any>({
        path: `/user/${id}`,
        method: 'PATCH',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserControllerRemove
     * @request DELETE:/user/{id}
     * @secure
     */
    userControllerRemove: (id: string, params: RequestParams = {}) =>
      this.request<ResponseDto, any>({
        path: `/user/${id}`,
        method: 'DELETE',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserControllerVerifieUser
     * @request PATCH:/user/verfieUser/{id}
     * @secure
     */
    userControllerVerifieUser: (id: string, params: RequestParams = {}) =>
      this.request<ResponseDto, any>({
        path: `/user/verfieUser/${id}`,
        method: 'PATCH',
        secure: true,
        format: 'json',
        ...params,
      }),
  };
  auth = {
    /**
     * No description
     *
     * @tags auth
     * @name AuthControllerLogin
     * @request POST:/auth/login
     */
    authControllerLogin: (data: LoginDto, params: RequestParams = {}) =>
      this.request<AuthResponseDto, any>({
        path: `/auth/login`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth
     * @name AuthControllerLogout
     * @request POST:/auth/logout
     */
    authControllerLogout: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/auth/logout`,
        method: 'POST',
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth
     * @name AuthControllerRegister
     * @request POST:/auth/register
     */
    authControllerRegister: (data: UserDTO, params: RequestParams = {}) =>
      this.request<AuthResponseDto, any>({
        path: `/auth/register`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth
     * @name AuthControllerRefreshToken
     * @request POST:/auth/refresh-token
     * @secure
     */
    authControllerRefreshToken: (data: RefreshTokenDto, params: RequestParams = {}) =>
      this.request<AuthResponseDto, any>({
        path: `/auth/refresh-token`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth
     * @name AuthControllerRequestPasswordReset
     * @request POST:/auth/request-reset-password-email
     */
    authControllerRequestPasswordReset: (data: ResetPasswordReqDto, params: RequestParams = {}) =>
      this.request<ResetPasswordDto, any>({
        path: `/auth/request-reset-password-email`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth
     * @name AuthControllerResetPassword
     * @request POST:/auth/reset-password
     */
    authControllerResetPassword: (data: ResetPasswordDto, params: RequestParams = {}) =>
      this.request<ResetPasswordDto, any>({
        path: `/auth/reset-password`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth
     * @name AuthControllerGetAuthenticatedUser
     * @request GET:/auth/me
     * @secure
     */
    authControllerGetAuthenticatedUser: (params: RequestParams = {}) =>
      this.request<AuthResponseDto, any>({
        path: `/auth/me`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),
  };
  generatePdf = {
    /**
     * No description
     *
     * @tags generate-pdf
     * @name GeneratePdfControllerGetPdf
     * @request GET:/generate-pdf
     */
    generatePdfControllerGetPdf: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/generate-pdf`,
        method: 'GET',
        ...params,
      }),
  };
  productDetails = {
    /**
     * No description
     *
     * @name ProductDetailControllerCreate
     * @request POST:/product-details
     */
    productDetailControllerCreate: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/product-details`,
        method: 'POST',
        ...params,
      }),

    /**
     * No description
     *
     * @name ProductDetailControllerFindAll
     * @request GET:/product-details
     */
    productDetailControllerFindAll: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/product-details`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @name ProductDetailControllerFindOne
     * @request GET:/product-details/{id}
     */
    productDetailControllerFindOne: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/product-details/${id}`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @name ProductDetailControllerUpdate
     * @request PATCH:/product-details/{id}
     */
    productDetailControllerUpdate: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/product-details/${id}`,
        method: 'PATCH',
        ...params,
      }),

    /**
     * No description
     *
     * @name ProductDetailControllerRemove
     * @request DELETE:/product-details/{id}
     */
    productDetailControllerRemove: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/product-details/${id}`,
        method: 'DELETE',
        ...params,
      }),
  };
  productOptions = {
    /**
     * No description
     *
     * @name ProductOptionControllerCreate
     * @request POST:/product-options
     */
    productOptionControllerCreate: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/product-options`,
        method: 'POST',
        ...params,
      }),

    /**
     * No description
     *
     * @name ProductOptionControllerFindAll
     * @request GET:/product-options
     */
    productOptionControllerFindAll: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/product-options`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @name ProductOptionControllerFindOne
     * @request GET:/product-options/{id}
     */
    productOptionControllerFindOne: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/product-options/${id}`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @name ProductOptionControllerUpdate
     * @request PATCH:/product-options/{id}
     */
    productOptionControllerUpdate: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/product-options/${id}`,
        method: 'PATCH',
        ...params,
      }),

    /**
     * No description
     *
     * @name ProductOptionControllerRemove
     * @request DELETE:/product-options/{id}
     */
    productOptionControllerRemove: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/product-options/${id}`,
        method: 'DELETE',
        ...params,
      }),
  };
  productCollections = {
    /**
     * No description
     *
     * @name ProductCollectionControllerCreate
     * @request POST:/product-collections
     */
    productCollectionControllerCreate: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/product-collections`,
        method: 'POST',
        ...params,
      }),

    /**
     * No description
     *
     * @name ProductCollectionControllerFindAll
     * @request GET:/product-collections
     */
    productCollectionControllerFindAll: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/product-collections`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @name ProductCollectionControllerFindOne
     * @request GET:/product-collections/{id}
     */
    productCollectionControllerFindOne: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/product-collections/${id}`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @name ProductCollectionControllerUpdate
     * @request PATCH:/product-collections/{id}
     */
    productCollectionControllerUpdate: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/product-collections/${id}`,
        method: 'PATCH',
        ...params,
      }),

    /**
     * No description
     *
     * @name ProductCollectionControllerRemove
     * @request DELETE:/product-collections/{id}
     */
    productCollectionControllerRemove: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/product-collections/${id}`,
        method: 'DELETE',
        ...params,
      }),
  };
  userProductDetails = {
    /**
     * No description
     *
     * @name UserProductDetailControllerCreate
     * @request POST:/user-product-details
     */
    userProductDetailControllerCreate: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/user-product-details`,
        method: 'POST',
        ...params,
      }),

    /**
     * No description
     *
     * @name UserProductDetailControllerFindAll
     * @request GET:/user-product-details
     */
    userProductDetailControllerFindAll: (
      query: {
        page: string;
        pageSize: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/user-product-details`,
        method: 'GET',
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @name UserProductDetailControllerFindOne
     * @request GET:/user-product-details/{id}
     */
    userProductDetailControllerFindOne: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/user-product-details/${id}`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @name UserProductDetailControllerUpdate
     * @request PATCH:/user-product-details/{id}
     */
    userProductDetailControllerUpdate: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/user-product-details/${id}`,
        method: 'PATCH',
        ...params,
      }),

    /**
     * No description
     *
     * @name UserProductDetailControllerRemove
     * @request DELETE:/user-product-details/{id}
     */
    userProductDetailControllerRemove: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/user-product-details/${id}`,
        method: 'DELETE',
        ...params,
      }),
  };
  markets = {
    /**
     * No description
     *
     * @name MarketControllerCreate
     * @request POST:/markets
     */
    marketControllerCreate: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/markets`,
        method: 'POST',
        ...params,
      }),

    /**
     * No description
     *
     * @name MarketControllerFindAll
     * @request GET:/markets
     */
    marketControllerFindAll: (
      query: {
        page: string;
        pageSize: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/markets`,
        method: 'GET',
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @name MarketControllerFindOne
     * @request GET:/markets/{id}
     */
    marketControllerFindOne: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/markets/${id}`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @name MarketControllerUpdate
     * @request PATCH:/markets/{id}
     */
    marketControllerUpdate: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/markets/${id}`,
        method: 'PATCH',
        ...params,
      }),

    /**
     * No description
     *
     * @name MarketControllerRemove
     * @request DELETE:/markets/{id}
     */
    marketControllerRemove: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/markets/${id}`,
        method: 'DELETE',
        ...params,
      }),
  };
  stores = {
    /**
     * No description
     *
     * @name StoreControllerCreate
     * @request POST:/stores
     */
    storeControllerCreate: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/stores`,
        method: 'POST',
        ...params,
      }),

    /**
     * No description
     *
     * @name StoreControllerFindAll
     * @request GET:/stores
     */
    storeControllerFindAll: (
      query: {
        page: string;
        pageSize: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/stores`,
        method: 'GET',
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @name StoreControllerFindOne
     * @request GET:/stores/{id}
     */
    storeControllerFindOne: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/stores/${id}`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @name StoreControllerUpdate
     * @request PATCH:/stores/{id}
     */
    storeControllerUpdate: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/stores/${id}`,
        method: 'PATCH',
        ...params,
      }),

    /**
     * No description
     *
     * @name StoreControllerRemove
     * @request DELETE:/stores/{id}
     */
    storeControllerRemove: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/stores/${id}`,
        method: 'DELETE',
        ...params,
      }),
  };
  marketApiKeys = {
    /**
     * No description
     *
     * @name MarketApiKeyControllerCreate
     * @request POST:/market-api-keys
     */
    marketApiKeyControllerCreate: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/market-api-keys`,
        method: 'POST',
        ...params,
      }),

    /**
     * No description
     *
     * @name MarketApiKeyControllerFindAll
     * @request GET:/market-api-keys
     */
    marketApiKeyControllerFindAll: (
      query: {
        page: string;
        pageSize: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/market-api-keys`,
        method: 'GET',
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @name MarketApiKeyControllerFindOne
     * @request GET:/market-api-keys/{id}
     */
    marketApiKeyControllerFindOne: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/market-api-keys/${id}`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @name MarketApiKeyControllerUpdate
     * @request PATCH:/market-api-keys/{id}
     */
    marketApiKeyControllerUpdate: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/market-api-keys/${id}`,
        method: 'PATCH',
        ...params,
      }),

    /**
     * No description
     *
     * @name MarketApiKeyControllerRemove
     * @request DELETE:/market-api-keys/{id}
     */
    marketApiKeyControllerRemove: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/market-api-keys/${id}`,
        method: 'DELETE',
        ...params,
      }),
  };
  posts = {
    /**
     * No description
     *
     * @name PostsControllerGetPosts
     * @request GET:/posts
     */
    postsControllerGetPosts: (
      query: {
        boardId: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/posts`,
        method: 'GET',
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @name PostsControllerCreatePost
     * @request POST:/posts
     */
    postsControllerCreatePost: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/posts`,
        method: 'POST',
        ...params,
      }),

    /**
     * No description
     *
     * @name PostsControllerGetPost
     * @request GET:/posts/{id}
     */
    postsControllerGetPost: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/posts/${id}`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @name PostsControllerUpdatePost
     * @request PUT:/posts/{id}
     */
    postsControllerUpdatePost: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/posts/${id}`,
        method: 'PUT',
        ...params,
      }),

    /**
     * No description
     *
     * @name PostsControllerDeletePost
     * @request DELETE:/posts/{id}
     */
    postsControllerDeletePost: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/posts/${id}`,
        method: 'DELETE',
        ...params,
      }),
  };
  sourcingSites = {
    /**
     * No description
     *
     * @name SourcingSiteControllerCreate
     * @request POST:/sourcing-sites
     */
    sourcingSiteControllerCreate: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/sourcing-sites`,
        method: 'POST',
        ...params,
      }),

    /**
     * No description
     *
     * @name SourcingSiteControllerFindAll
     * @request GET:/sourcing-sites
     */
    sourcingSiteControllerFindAll: (
      query: {
        page: string;
        pageSize: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/sourcing-sites`,
        method: 'GET',
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @name SourcingSiteControllerFindOne
     * @request GET:/sourcing-sites/{id}
     */
    sourcingSiteControllerFindOne: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/sourcing-sites/${id}`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @name SourcingSiteControllerUpdate
     * @request PATCH:/sourcing-sites/{id}
     */
    sourcingSiteControllerUpdate: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/sourcing-sites/${id}`,
        method: 'PATCH',
        ...params,
      }),

    /**
     * No description
     *
     * @name SourcingSiteControllerRemove
     * @request DELETE:/sourcing-sites/{id}
     */
    sourcingSiteControllerRemove: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/sourcing-sites/${id}`,
        method: 'DELETE',
        ...params,
      }),
  };
}
