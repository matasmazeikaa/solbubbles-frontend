export type GamePool = {
  version: "0.1.0";
  name: "game_pool";
  instructions: [
    {
      name: "initialise";
      accounts: [
        {
          name: "gamePoolAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "user";
          isMut: true;
          isSigner: true;
        },
        {
          name: "authority";
          isMut: false;
          isSigner: true;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "depositLamports";
      accounts: [
        {
          name: "user";
          isMut: true;
          isSigner: true;
        },
        {
          name: "gamePoolAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        }
      ];
    },
    {
      name: "depositSplTokens";
      accounts: [
        {
          name: "user";
          isMut: false;
          isSigner: true;
        },
        {
          name: "userAta";
          isMut: true;
          isSigner: false;
        },
        {
          name: "gamePoolAta";
          isMut: true;
          isSigner: false;
        },
        {
          name: "gamePoolAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        }
      ];
    },
    {
      name: "withdrawSplTokens";
      accounts: [
        {
          name: "authority";
          isMut: false;
          isSigner: true;
        },
        {
          name: "userAta";
          isMut: true;
          isSigner: false;
        },
        {
          name: "gamePoolAta";
          isMut: true;
          isSigner: false;
        },
        {
          name: "gamePoolAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        }
      ];
    },
    {
      name: "withdrawLamports";
      accounts: [
        {
          name: "authority";
          isMut: false;
          isSigner: true;
        },
        {
          name: "user";
          isMut: true;
          isSigner: true;
        },
        {
          name: "gamePoolAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        }
      ];
    }
  ];
  accounts: [
    {
      name: "gamePoolAccount";
      type: {
        kind: "struct";
        fields: [
          {
            name: "authority";
            type: "publicKey";
          },
          {
            name: "lamportAmountDeposited";
            type: "u64";
          },
          {
            name: "splTokenAmountDeposited";
            type: "u64";
          },
          {
            name: "isInitialized";
            type: "bool";
          }
        ];
      };
    }
  ];
  errors: [
    {
      code: 6000;
      name: "IncorrectProgramId";
      msg: "The authority is not the owner of the account";
    },
    {
      code: 6001;
      name: "InsufficientFunds";
      msg: "Insufficient funds";
    }
  ];
};

export const IDL: GamePool = {
  version: "0.1.0",
  name: "game_pool",
  instructions: [
    {
      name: "initialise",
      accounts: [
        {
          name: "gamePoolAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "user",
          isMut: true,
          isSigner: true,
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "depositLamports",
      accounts: [
        {
          name: "user",
          isMut: true,
          isSigner: true,
        },
        {
          name: "gamePoolAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "amount",
          type: "u64",
        },
      ],
    },
    {
      name: "depositSplTokens",
      accounts: [
        {
          name: "user",
          isMut: false,
          isSigner: true,
        },
        {
          name: "userAta",
          isMut: true,
          isSigner: false,
        },
        {
          name: "gamePoolAta",
          isMut: true,
          isSigner: false,
        },
        {
          name: "gamePoolAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "amount",
          type: "u64",
        },
      ],
    },
    {
      name: "withdrawSplTokens",
      accounts: [
        {
          name: "authority",
          isMut: false,
          isSigner: true,
        },
        {
          name: "userAta",
          isMut: true,
          isSigner: false,
        },
        {
          name: "gamePoolAta",
          isMut: true,
          isSigner: false,
        },
        {
          name: "gamePoolAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "amount",
          type: "u64",
        },
      ],
    },
    {
      name: "withdrawLamports",
      accounts: [
        {
          name: "authority",
          isMut: false,
          isSigner: true,
        },
        {
          name: "user",
          isMut: true,
          isSigner: true,
        },
        {
          name: "gamePoolAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "amount",
          type: "u64",
        },
      ],
    },
  ],
  accounts: [
    {
      name: "gamePoolAccount",
      type: {
        kind: "struct",
        fields: [
          {
            name: "authority",
            type: "publicKey",
          },
          {
            name: "lamportAmountDeposited",
            type: "u64",
          },
          {
            name: "splTokenAmountDeposited",
            type: "u64",
          },
          {
            name: "isInitialized",
            type: "bool",
          },
        ],
      },
    },
  ],
  errors: [
    {
      code: 6000,
      name: "IncorrectProgramId",
      msg: "The authority is not the owner of the account",
    },
    {
      code: 6001,
      name: "InsufficientFunds",
      msg: "Insufficient funds",
    },
  ],
};
