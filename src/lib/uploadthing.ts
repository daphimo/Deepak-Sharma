// Lightweight placeholder router to satisfy UploadThing typings without
// requiring the Next.js server runtime. The hooks using this type fall back
// to local object URLs when no server route exists.
export type OurFileRouter = Record<string, unknown>;

export const ourFileRouter: OurFileRouter = {
  editorUploader: {},
};
