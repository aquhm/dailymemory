import { Diary } from "../../../stores/DiaryStore";

export default interface DiaryViewFooter {
  height?: number;
  diary?: Diary;
  color?: string;
  backgroundBarColor?: string;
  open?: boolean;
  onPrevPress: () => void;
  right?: {
    buttons: any[];
  };
}
