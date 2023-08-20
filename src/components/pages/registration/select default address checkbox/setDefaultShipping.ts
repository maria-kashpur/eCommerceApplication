export default function setShippingDefault(): void {
  const defaultShippingCheckbox = document.getElementById(
    "default_shipping_checkbox",
  ) as HTMLInputElement;
  const defaultBillingCheckbox = document.getElementById(
    "default_billing_checkbox",
  ) as HTMLInputElement;
  const billingStreet = document.getElementById(
    "billing_street",
  ) as HTMLInputElement;
  const billingBuilding = document.getElementById(
    "billing_building",
  ) as HTMLInputElement;
  const billingApartment = document.getElementById(
    "billing_apartment",
  ) as HTMLInputElement;
  const billingCity = document.getElementById(
    "billing_city",
  ) as HTMLInputElement;
  const billingPostalCode = document.getElementById(
    "billing_postal_code",
  ) as HTMLInputElement;
  const billingCountry = document.getElementById(
    "billing_country",
  ) as HTMLSelectElement;
  const shippingStreet = document.getElementById(
    "shipping_street",
  ) as HTMLInputElement;
  const shippingBuilding = document.getElementById(
    "shipping_building",
  ) as HTMLInputElement;
  const shippingApartment = document.getElementById(
    "shipping_apartment",
  ) as HTMLInputElement;
  const shippingCity = document.getElementById(
    "shipping_city",
  ) as HTMLInputElement;
  const shippingPostalCode = document.getElementById(
    "shipping_postal_code",
  ) as HTMLInputElement;
  const shippingCountry = document.getElementById(
    "shipping_country",
  ) as HTMLSelectElement;

  if (
    defaultShippingCheckbox instanceof HTMLInputElement &&
    defaultBillingCheckbox instanceof HTMLInputElement &&
    shippingStreet instanceof HTMLInputElement &&
    shippingBuilding instanceof HTMLInputElement &&
    shippingApartment instanceof HTMLInputElement &&
    shippingCity instanceof HTMLInputElement &&
    shippingPostalCode instanceof HTMLInputElement &&
    shippingCountry instanceof HTMLSelectElement &&
    billingStreet instanceof HTMLInputElement &&
    billingBuilding instanceof HTMLInputElement &&
    billingApartment instanceof HTMLInputElement &&
    billingCity instanceof HTMLInputElement &&
    billingPostalCode instanceof HTMLInputElement &&
    billingCountry instanceof HTMLSelectElement
  ) {
    if (defaultShippingCheckbox.checked) {
      billingStreet.value = shippingStreet.value;
      billingBuilding.value = shippingBuilding.value;
      billingApartment.value = shippingApartment.value;
      billingCity.value = shippingCity.value;
      billingPostalCode.value = shippingPostalCode.value;
      billingCountry.value = shippingCountry.value;

      billingStreet.disabled = true;
      billingBuilding.disabled = true;
      billingApartment.disabled = true;
      billingCity.disabled = true;
      billingPostalCode.disabled = true;
      billingCountry.disabled = true;

      defaultBillingCheckbox.disabled = true;
    } else {
      billingStreet.disabled = false;
      billingBuilding.disabled = false;
      billingApartment.disabled = false;
      billingCity.disabled = false;
      billingPostalCode.disabled = false;
      billingCountry.disabled = false;

      defaultBillingCheckbox.disabled = false;
    }
  }
}