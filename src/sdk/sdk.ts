import { apiRoot, projectKey } from "./commercetoolsApiRoot";

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
  key: string,
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

export function getUser(email: string, password: string) {
  return apiRoot
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