import { BaseRecord } from ".";

export default interface UserRecord extends BaseRecord {
  name: string;
  email: string;
  profile_uri: string | undefined;
}
