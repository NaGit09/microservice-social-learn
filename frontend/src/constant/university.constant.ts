export const universities = [
    { name: "Đại học Bách khoa Hà Nội", code: "HUST" },
    { name: "Đại học Bách khoa TP.HCM", code: "BKU" },
    { name: "Đại học Công nghệ - ĐHQG Hà Nội", code: "UET" },
    { name: "Đại học Khoa học Tự nhiên - ĐHQG HCM", code: "HCMUS" },
    { name: "Đại học Khoa học Tự nhiên - ĐHQG Hà Nội", code: "HUS" },
    { name: "Đại học Công nghệ thông tin - ĐHQG HCM", code: "UIT" },
    { name: "Đại học Kinh tế - Luật - ĐHQG HCM", code: "UEL" },
    { name: "Đại học Kinh tế TP.HCM", code: "UEH" },
    { name: "Đại học Ngân hàng TP.HCM", code: "BUH" },
    { name: "Đại học Ngoại thương", code: "FTU" },
    { name: "Đại học Nông Lâm TP.HCM", code: "NLU" },
    { name: "Đại học Sư phạm Kỹ thuật TP.HCM", code: "HCMUTE" },
    { name: "Đại học Sư phạm Hà Nội", code: "HNUE" },
    { name: "Đại học Sài Gòn", code: "SGU" },
    { name: "Đại học Tôn Đức Thắng", code: "TDTU" },
    { name: "Đại học Hoa Sen", code: "HSU" },
    { name: "Đại học FPT", code: "FPTU" },
    { name: "Đại học RMIT Việt Nam", code: "RMIT" },
    { name: "Đại học Quốc tế - ĐHQG HCM", code: "HCMIU" },
    { name: "Đại học Mở TP.HCM", code: "OU" },
];

export const getUniversityName = (code: string) => {
    const uni = universities.find(u => u.code === code);
    return uni ? uni.name : null;
};
