import { ApiRoot } from "@commercetools/platform-sdk";
import { apiRoot, projectKey } from "./commercetoolsApiRoot";
import { Address } from "../types/types";

export function getProjectDetails() {
  return apiRoot.withProjectKey({ projectKey }).get().execute();
}

export function getCustomers() {
  return apiRoot.withProjectKey({ projectKey }).customers().get().execute();
}

export function registerUser(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  countryCode: string,
  key?: string,
) {
  return apiRoot
    .withProjectKey({ projectKey })
    .customers()
    .post({
      body: {
        email,
        password,
        key,
        firstName,
        lastName,
        addresses: [
          {
            country: countryCode,
          },
        ],
        defaultShippingAddress: 0,
      },
    })
    .execute();
}

export function getUser(
  email: string,
  password: string,
  passwordApiRoot: ApiRoot,
) {
  return passwordApiRoot
    .withProjectKey({ projectKey })
    .me()
    .login()
    .post({
      body: {
        email,
        password,
        updateProductData: true,
        // anonymousId: options?.anonymousId,
        // anonymousCartSignInMode: "MergeWithExistingCustomerCart",
      },
    })
    .execute();
}
export function registerUser2(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  dateOfBirth: string,
  address1: Address,
  address2: Address,
  shippingDefaultCheckbox: string,
  billingDefaultCheckbox: string,
) {
  return apiRoot
    .withProjectKey({ projectKey })
    .customers()
    .post({
      body: {
        email,
        password,
        firstName,
        lastName,
        dateOfBirth,
        addresses: [address1, address2],
        shippingAddresses: [0],
        billingAddresses: [1],
        defaultShippingAddress:
          shippingDefaultCheckbox === "on" ? 0 : undefined,
        defaultBillingAddress: billingDefaultCheckbox === "on" ? 1 : undefined,
      },
    })
    .execute();
}

export async function getSerchingProducts(filterParams: string[]) {
  return apiRoot
    .withProjectKey({ projectKey })
    .productProjections()
    .search()
    .get({
      queryArgs: {
        filter: filterParams,
      },
    })
    .execute();
}

export async function getProducts() {
  return apiRoot.withProjectKey({ projectKey }).products().get().execute();
}

export async function getProduct(id: string) {
  const res = apiRoot
    .withProjectKey({ projectKey })
    .products()
    .withId({ ID: id })
    .get()
    .execute();
  return res;
}

export async function getCategories() {
  return apiRoot.withProjectKey({ projectKey }).categories().get().execute();
}
