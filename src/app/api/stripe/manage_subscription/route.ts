import manageSubscription from "../handlers/manage_subscription";

export async function GET() {
  return manageSubscription();
}
