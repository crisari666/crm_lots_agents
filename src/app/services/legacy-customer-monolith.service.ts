import Api from "../axios";

export async function recycleCustomerMonolithReq(params: { readonly customerId: string }): Promise<boolean> {
  try {
    const api = Api.getInstance();
    const response = await api.patch({ path: `customers/recycle-customer/${params.customerId}` });
    const { error } = response;
    if (error == null) {
      return response.result;
    }
    throw error;
  } catch (error) {
    console.error("ERROR ON recycleCustomerMonolithReq");
    console.error({ error });
    throw error;
  }
}
