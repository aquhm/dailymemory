import { DiaryRecord } from "../../../shared/records";

export default interface DiaryViewFooter {
  height?: number;
  diary?: DiaryRecord;
  color?: string;
  backgroundBarColor?: string;
  open?: boolean;
  onPrevPress: () => void;
  right?: {
    buttons: any[];
  };
}
