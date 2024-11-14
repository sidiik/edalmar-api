"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genSlug = void 0;
const slugify_1 = require("slugify");
const genSlug = (text) => {
    return (0, slugify_1.default)(text, {
        replacement: '-',
        lower: true,
        strict: true,
        locale: 'en',
        trim: true,
    });
};
exports.genSlug = genSlug;
//# sourceMappingURL=slug.js.map