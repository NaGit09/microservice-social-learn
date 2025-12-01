export const majors = [
    { name: "Công nghệ thông tin", code: "CNTT" },
    { name: "Khoa học máy tính", code: "CS" },
    { name: "Kỹ thuật phần mềm", code: "SE" },
    { name: "Hệ thống thông tin", code: "IS" },
    { name: "Trí tuệ nhân tạo", code: "AI" },
    { name: "An toàn thông tin", code: "ATTT" },
    { name: "Mạng máy tính & Truyền thông", code: "NET" },

    { name: "Quản trị kinh doanh", code: "QTKD" },
    { name: "Marketing", code: "MKT" },
    { name: "Kinh doanh quốc tế", code: "IB" },
    { name: "Tài chính - Ngân hàng", code: "TCNH" },
    { name: "Kế toán", code: "KT" },
    { name: "Kiểm toán", code: "KToan" },

    { name: "Luật", code: "LAW" },
    { name: "Luật Kinh tế", code: "LKE" },

    { name: "Y khoa", code: "YK" },
    { name: "Dược học", code: "DUOC" },
    { name: "Điều dưỡng", code: "DD" },
    { name: "Răng - Hàm - Mặt", code: "RHM" },

    { name: "Cơ khí", code: "CK" },
    { name: "Điện - Điện tử", code: "DEE" },
    { name: "Tự động hóa", code: "TDH" },
    { name: "Công nghệ thực phẩm", code: "CNTP" },
    { name: "Kỹ thuật môi trường", code: "MT" },

    { name: "Kiến trúc", code: "KTruc" },
    { name: "Thiết kế đồ họa", code: "TKDH" },
    { name: "Thiết kế nội thất", code: "TKNT" },

    { name: "Ngôn ngữ Anh", code: "NNA" },
    { name: "Ngôn ngữ Trung", code: "NNT" },
    { name: "Ngôn ngữ Hàn", code: "NNH" },
    { name: "Ngôn ngữ Nhật", code: "NNJ" },

    { name: "Tâm lý học", code: "TLH" },
    { name: "Giáo dục mầm non", code: "MN" },
    { name: "Giáo dục tiểu học", code: "TH" },

    { name: "Nông học", code: "NH" },
    { name: "Chăn nuôi", code: "CN" },
    { name: "Lâm nghiệp", code: "LN" },
    { name: "Thú y", code: "TY" },
];

export const getMajorName = (code: string) => {
    const m = majors.find(x => x.code === code);
    return m ? m.name : null;
};
