import {getSortMarkup} from "./sort";
import {getTripDaysListMarkup} from "./tripDays";


const getCombineMainMarkup = () => getSortMarkup() + getTripDaysListMarkup();

export {getCombineMainMarkup};

