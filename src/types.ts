export type Ctx = {
  from: {
    id: number;
  };
  chat: {
    id: number;
  };
};

export type UpdateCtx = Ctx & {
  update: {
    message: {
      text: string;
    };
  };
};

export type AudioCtx = Ctx & {
  message: {
    voice?: {
      file_id: string;
    };
  };
};

export type UpdateDocCtx = Ctx & {
  update?: {
    message?: {
      document?: {
        file_id?: string;
        file_unique_id?: string;
      };
    };
  };
};

export type Reply = {
  replyWithPhoto: (image: string) => void;
};
