/* eslint-disable no-unused-vars */
/* eslint-disable func-names */
import { format, isValid } from 'date-fns';
import * as XLSX from 'xlsx';

export const Image_Base_URL = import.meta.env.VITE_API_URL;

export const formatDateInWords = (date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const current_date = new Date(date);
    const month_value = current_date.getMonth();
    const day_value = current_date.getDate();
    const year = current_date.getUTCFullYear();

    return date ? `${day_value} ${months[month_value]}, ${year}` : '';
};

export const formatDateToString = (date) => {
    const d = new Date(date);
    let month = `${d.getMonth() + 1}`;
    let day = `${d.getDate()}`;
    const year = d.getFullYear();
    if (month.length < 2) month = `0${month}`;
    if (day.length < 2) day = `0${day}`;
    return [day, month, year].join('/');
};

export const formatRegistrationDate = (date) => {
    const d = new Date(date);
    let month = `${d.getMonth() + 1}`;
    let day = `${d.getDate()}`;
    const year = d.getFullYear().toString();
    if (month.length < 2) month = `0${month}`;
    if (day.length < 2) day = `0${day}`;
    return [month, day, year].join('/');
};

export const formatWorkResumptionDate = (date) => {
    const d = new Date(date);
    let month = `${d.getMonth() + 1}`;
    let day = `${d.getDate()}`;
    const year = d.getFullYear().toString().substring(2);
    if (month.length < 2) month = `0${month}`;
    if (day.length < 2) day = `0${day}`;
    return [year, month, day].join('-');
};

export const formatAutoDenyDate = (date) => {
    const d = new Date(date);
    let month = `${d.getMonth() + 1}`;
    let day = `${d.getDate()}`;
    const year = d.getFullYear().toString();
    if (month.length < 2) month = `0${month}`;
    if (day.length < 2) day = `0${day}`;
    return [year, month, day].join('-');
};

export const formatAmount = (n) => {
    return n
        ? `₦${Number(n || 0)
              .toFixed(2)
              .replace(/./g, function (c, i, a) {
                  return i > 0 && c !== '.' && (a.length - i) % 3 === 0 ? `,${c}` : c;
              })}`
        : '₦ -';
};

export const formatAmountNoDecimal = (n) => {
    return n
        ? `₦${Number(n)
              .toFixed(0)
              .replace(/./g, function (c, i, a) {
                  return i > 0 && c !== '.' && (a.length - i) % 3 === 0 ? `,${c}` : c;
              })}`
        : '₦ -';
};

export const formatNumber = (n) => {
    return (
        n &&
        Number(n)
            .toFixed(0)
            .replace(/./g, function (c, i, a) {
                return i > 0 && c !== '.' && (a.length - i) % 3 === 0 ? `,${c}` : c;
            })
    );
};

export const paystackFee = (amount) => {
    const cost = parseInt(amount);

    if (cost < 2500) {
        const fee = 0.015 * cost * 1.06;

        if (fee < 39.115) {
            return Math.round(fee);
        }
        return Math.round(fee + 100);
    }
    const fee = 0.015 * cost * 1.055 + 100;
    if (fee > 2000) {
        return 2000;
    }
    return Math.round(fee);
};

export const getYearFromDate = (date) => {
    const formatted_date = new Date(date);
    const year = formatted_date.getFullYear().toString();

    return year;
};

export const firstLetter = (letter) => {
    const str = letter;

    if (typeof str === 'string') return str.substring(0, 1);
    return '';
};

export const statusStyling = (status) => {
    switch (status) {
        case 'active':
            return 'success';
        case 'info':
            return 'info';
        case 'completed':
            return 'secondary';
        case 'registered':
            return 'secondary';
        case 'unregistered':
            return 'warning';
        case 'complete':
            return 'secondary';
        case 'pending':
            return 'warning';
        case 'incomplete':
            return 'warning';
        case 'denied':
            return 'error';
        case null:
            return 'warning';
        default:
            return 'success';
    }
};

export const validateLoanAmount = (purpose) => {
    switch (purpose) {
        case 'Retail Merchants':
            return { name: 'Retail Merchants', min: 50000, max: 2000000 };
        case 'Wholesalers':
            return { name: 'Wholesalers', min: 300000, max: 10000000 };
        case 'SMEs':
            return { name: 'SMEs', min: 300000, max: 20000000 };
        default:
            return { name: 'Retail Merchants', min: 50000, max: 2000000 };
    }
};

export const getInterestRate = (purpose) => {
    switch (purpose) {
        case 'Retail Merchants':
            return 7;
        case 'Wholesalers':
            return 6;
        case 'SMEs':
            return 5;
        default:
            return 7;
    }
};

// Local storage operations
export const useLocalStorage = {
    set: (key, data) => {
        const stringifiedData = JSON.stringify(data);
        localStorage.setItem(key, stringifiedData);
    },

    get: (key) => {
        const data = JSON.parse(localStorage.getItem(key));

        if (!data) {
            return null;
        }
        return data;
    },

    remove: (key) => {
        localStorage.removeItem(key);
    },

    clear: () => {
        localStorage.clear();
    },
};

export const getArrayNthElement = (array, n) => {
    // eslint-disable-next-line no-void
    if (array == null) return void 0;
    if (n == null) return array[array.length - 1];
    return array.slice(Math.max(array.length - n, 0));
};

export const sumOfObjectKeys = (array, key) => {
    return array.reduce((a, b) => a + (b[key] || 0), 0);
};

export const ObjIsEmpty = (obj) => {
    if (Object.keys(obj).length === 0 && obj.constructor === Object) {
        return true;
    }
    return false;
};

export const successStatusCode = 200 || 201;

export const capitalize = (string) => {
    return string.replace(/\b\w/g, (l) => l.toUpperCase());
};

export const isEmpty = (value) => {
    // eslint-disable-next-line use-isnan
    if (value === null || value === undefined || value === '' || value === NaN) {
        return true;
    }
    return false;
};

export const exportFileAsExcel = (tableID, sheetName, workbookName) => {
    const table_elt = document.getElementById(tableID);

    const wb = XLSX.utils.table_to_book(table_elt, { sheet: sheetName });

    XLSX.writeFile(wb, `${workbookName}.xlsx`);
};

// export const dateInISO = (date) => {
//     return new Date(date).toISOString().split('T')[0];
// };
// export const isValidDate = (value) => {
//     if (!value) return false;

//     const [d, t] = value.split(' ');
//     const date = new Date(`${d}T${t}` || new Date()); // safari/iOS fix
//     // eslint-disable-next-line no-restricted-globals
//     return date instanceof Date && !isNaN(date.getTime());
// };

export const dateInISO = (date) => {
    const parsedDate = new Date(date);
    if (isValid(parsedDate)) {
        return format(parsedDate, 'yyyy-MM-dd');
    }
    return format(new Date(), 'yyyy-MM-dd');
};

export const dateInYMD = (date) => {
    const parsedDate = new Date(date);
    if (isValid(parsedDate)) {
        return format(parsedDate, 'yyyy-MM-dd')?.split('T')[0];
    }
    return format(new Date(), 'yyyy-MM-dd')?.split('T')[0];
};

export const isNullish = (obj) => {
    const isNull = (element) => element === null || element === undefined || element === '';

    if (typeof obj === 'object' && obj !== null) {
        const filteredObj = Object.entries(obj).filter(([key]) => key !== 'created_at' && key !== 'updated_at');
        return Object.values(filteredObj).some(([_, value]) => isNull(value));
    }

    return true;
};

export const checkIfObject = (obj) => {
    try {
        const parsed = JSON.parse(obj);
        return parsed && typeof parsed === 'object' && !Array.isArray(parsed) && parsed !== null;
    } catch (error) {
        return false;
    }
};

export const checkFileExtension = (fileName, allowedExtensions) => {
    const fileExtension = fileName.split('.').pop();
    return allowedExtensions.includes(fileExtension);
};

export const getNumbers = (str) => {
    return str.replace(/[^0-9]/g, '');
};

export const maskCurrency = (n) => {
    if (isEmpty(n)) return n;
    return getNumbers(n)
        .toString()
        .replace(/^0+/, '')
        .replace(/,/g, '')
        .replace(/\D/g, '')
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// strip commas
export const stripCommas = (n) => {
    return n.toString().replace(/,/g, '');
};

export const sluggify = (str) => {
    // Convert string to lowercase and replace non-word characters with hyphens
    const slug = str.toLowerCase().replace(/[\W_]+/g, '-');

    // Remove leading and trailing hyphens
    return slug.replace(/^-+|-+$/g, '');
};
export const isFileSizeValid = (file, size) => {
    if (file && file.size > 5 * 1024 * 1024) return false;
    return true;
};

export const buildQueryParams = (params) => {
    const queryParams = Object.entries(params)
        .filter(([_, value]) => value !== undefined)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');

    return queryParams ? `?${queryParams}` : '';
};

export const extractBranches = (data) => {
    const branches = [];
    const officers = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const branch of data) {
        branches.push({ name: branch?.name, value: branch?.id });

        // eslint-disable-next-line no-restricted-syntax
        for (const officer of branch.officers) {
            officers.push({ name: officer?.name, value: officer?.id });
        }
    }

    return [branches, officers];
};

export const extractBranchOfficers = (branch, id) => {
    const selectedBranch = branch?.find((b) => b.id === parseInt(id, 10));
    const branchOfficers = (selectedBranch?.officers || []).map((officer) => ({
        value: officer.id,
        name: officer.name,
    }));
    return branchOfficers || [];
};

// ⚠️ USE THIS INSTEAD OF THE ABOVE FUNCTION ⚠️
// export const extractBranches = (data) => {
//     const branches = data.map((branch) => ({ name: branch?.name, value: branch?.id }));
//     const officers = data.flatMap((branch) => branch.officers.map((officer) => ({ name: officer?.name, value: officer?.id })));

//     return [branches, officers];
// };

// eslint-disable-next-line consistent-return
export const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};

// Helper function to set a cookie with a given name, value, and expiration (in days)
export const setCookie = (name, value, expirationDays) => {
    const date = new Date();
    date.setTime(date.getTime() + expirationDays * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value}; ${expires}; path=/`;
};

export const isNumber = (value) => {
    return !Number.isNaN(Number(value));
};

export const createUserTypeFilter = (userTypes) => {
    return userTypes.length > 0 ? userTypes.map((userType) => `&filter[user_type][]=${userType}`).join('') : '';
};
