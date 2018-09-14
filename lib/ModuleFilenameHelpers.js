const ModuleFilenameHelpers = exports;


ModuleFilenameHelpers.createFooter = function createFooter(module, requestShortener) {
    if (!module) module = "";
    if (typeof module === "string") {
        return [
            "// WEBPACK FOOTER //",
            `// ${module}`
        ].join("\n");
    } else {
        return [
            "//////////////////",
            "// WEBPACK FOOTER",
            `// ${requestShortener}`,
            `// module id = ${module.id}`,
            `// module chunks = ${module.chunks.map(c => c.id).join(" ")}`
        ].join("\n");
    }
};


ModuleFilenameHelpers.createFilename = function createFilename(module) {
    if (!module) return ''

};
