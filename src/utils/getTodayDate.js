import { formatInTimeZone } from 'date-fns-tz';
const getTodayDate = () => {
    return formatInTimeZone(new Date(), 'Asia/Kolkata', 'yyyy-MM-dd');
};
export default getTodayDate;