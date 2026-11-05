/**
 * Crypto brand icons (tokens, networks, wallets, Web3 DB).
 *
 * Provides pixel-perfect SVGs for Whitechain, Archiv, USDT, WBT, ETH, BTC, USDC.
 */
import type { ReactNode } from "react"

type IconNode = [string, Record<string, string | number>, IconNode[]?]
type IconShape = "circle" | "squircle" | "none"
type IconDef = { nodes: IconNode[]; shape: IconShape; surface?: string }

export type TokenSymbol = "ETH" | "USDC" | "MON" | "USDT" | "DAI" | "WBT" | "BTC"
export type ChainId = "monad" | "ethereum" | "base" | "arbitrum" | "whitechain" | "archiv"
export type WalletId = "metamask" | "walletconnect" | "coinbase"

const TOKENS: Record<TokenSymbol, IconDef> = {
  ETH: {
    nodes: [
      ["path", { fill: "#8FFCF3", d: "M12 3v6.65l5.625 2.516z" }],
      ["path", { fill: "#CABCF8", d: "m12 3-5.625 9.166L12 9.651z" }],
      ["path", { fill: "#CBA7F5", d: "M12 16.477v4.522l5.625-7.784z" }],
      ["path", { fill: "#74A0F3", d: "M12 21v-4.523l-5.625-3.262z" }],
      ["path", { fill: "#CBA7F5", d: "m12 15.43 5.625-3.263L12 9.65z" }],
      ["path", { fill: "#74A0F3", d: "M6.375 12.167 12 15.429V9.651z" }],
      [
        "path",
        {
          fill: "#202699",
          d: "m12 15.429-5.625-3.263L12 3l5.625 9.166zM6.749 11.9l5.16-8.41v6.115zm-.077.23 5.238-2.327v5.364zm5.418-2.327v5.364l5.233-3.038zm0-.198 5.16 2.295-5.16-8.41z",
          fillRule: "evenodd",
          clipRule: "evenodd",
        },
      ],
      [
        "path",
        {
          fill: "#202699",
          d: "M12 16.406 6.375 13.21 12 21l5.625-7.79zm-4.995-2.633 4.905 2.79v4.005zm5.085 2.79v4.005l4.905-6.795z",
          fillRule: "evenodd",
          clipRule: "evenodd",
        },
      ],
    ],
    shape: "circle",
    surface: "#EEF0FF",
  },
  USDC: {
    nodes: [
      [
        "g",
        { clipPath: "url(#USDC__a)" },
        [
          ["path", { fill: "#0B53BF", d: "M24 0H0v24h24z" }],
          [
            "path",
            {
              fill: "#fff",
              d: "M12 20c4.435 0 8-3.565 8-8s-3.565-8-8-8-8 3.565-8 8 3.565 8 8 8m2.2-6.735c0-1.165-.7-1.565-2.1-1.73-1-.135-1.2-.4-1.2-.87 0-.465.335-.765 1-.765.6 0 .935.2 1.1.7.035.1.135.165.235.165h.53c.135 0 .235-.1.235-.23v-.036c-.135-.734-.735-1.434-1.5-1.5v-.734c0-.135-.1-.235-.265-.265h-.44c-.135 0-.26.1-.295.265V9c-1 .135-1.665.9-1.665 1.735 0 1.1.665 1.53 2.065 1.7.935.165 1.235.365 1.235.9 0 .53-.47.9-1.1.9-.87 0-1.17-.37-1.27-.87-.03-.13-.13-.2-.23-.2h-.57c-.13 0-.23.1-.23.235v.035c.13.83.665 1.4 1.765 1.565v.74c0 .135.1.224.265.26h.48c.13 0 .22-.09.255-.26V15c1-.165 1.7-.835 1.7-1.735m-5.566 2.49c.483.443 1.05.786 1.666 1.01.1.07.2.2.2.3v.47c0 .064 0 .1-.035.13-.03.134-.165.2-.3.134a6 6 0 0 1 0-11.435c.035-.03.1-.03.135-.03.135.03.2.13.2.265v.465c0 .17-.065.27-.2.335a4.93 4.93 0 0 0-2.965 2.965 4.965 4.965 0 0 0 1.299 5.391M13.535 6.5c.03-.135.165-.2.3-.135a6.05 6.05 0 0 1 3.9 3.935c1 3.165-.735 6.535-3.9 7.535-.035.03-.1.03-.135.03-.135-.03-.2-.13-.2-.265v-.465c0-.17.065-.27.2-.335a4.93 4.93 0 0 0 2.965-2.965 4.967 4.967 0 0 0-2.965-6.4c-.1-.07-.2-.2-.2-.335v-.465c0-.07 0-.1.035-.135",
              fillRule: "evenodd",
              clipRule: "evenodd",
            },
          ],
        ],
      ],
      [
        "defs",
        {},
        [["clipPath", { id: "USDC__a" }, [["path", { fill: "#fff", d: "M0 0h24v24H0z" }]]]],
      ],
    ],
    shape: "circle",
  },
  MON: {
    nodes: [
      [
        "g",
        { clipPath: "url(#monad__a)" },
        [
          ["path", { fill: "#836EF9", d: "M24 0H0v24h24z" }],
          [
            "path",
            {
              fill: "#fff",
              d: "M12 4c-2.31 0-8 5.69-8 8s5.69 8 8 8 8-5.69 8-8-5.69-8-8-8m-1.247 12.575c-.974-.266-3.593-4.847-3.328-5.822s4.848-3.593 5.822-3.328 3.593 4.847 3.328 5.822-4.847 3.593-5.822 3.328",
            },
          ],
        ],
      ],
      [
        "defs",
        {},
        [["clipPath", { id: "monad__a" }, [["path", { fill: "#fff", d: "M0 0h24v24H0z" }]]]],
      ],
    ],
    shape: "circle",
  },
  USDT: {
    nodes: [
      [
        "g",
        { clipPath: "url(#USDT__a)" },
        [
          ["path", { fill: "#009393", d: "M24 0H0v24h24z" }],
          [
            "path",
            {
              fill: "#fff",
              d: "m12 18.4-8-7.892L7.052 5.6h9.896L20 10.508zm.8-7.2v-.976c1.44.072 2.784.352 3.2.716-.484.424-2.216.732-4 .732s-3.516-.308-4-.732c.412-.364 1.76-.64 3.2-.72v.98zM8 10.936v.588c.412.364 1.756.64 3.2.72V14.4h1.6v-2.16c1.44-.072 2.788-.352 3.2-.716v-1.172c-.412-.364-1.76-.644-3.2-.72V8.8h2.4V7.6H8.8v1.2h2.4v.832c-1.444.076-2.788.356-3.2.72z",
            },
          ],
        ],
      ],
      [
        "defs",
        {},
        [["clipPath", { id: "USDT__a" }, [["path", { fill: "#fff", d: "M0 0h24v24H0z" }]]]],
      ],
    ],
    shape: "circle",
  },
  DAI: {
    nodes: [
      [
        "g",
        { clipPath: "url(#DAI__a)" },
        [
          ["path", { fill: "#FDC134", d: "M24 0H0v24h24z" }],
          [
            "path",
            {
              fill: "#fff",
              d: "M11.711 4.774H5.548V9.42H4v2.065h1.548v1.032H4v2.065h1.548v4.645h6.163a7.265 7.265 0 0 0 6.782-4.645H20v-2.065h-1.053a7 7 0 0 0 0-1.032H20V9.419h-1.507a7.27 7.27 0 0 0-6.782-4.645m5.161 7.742a5 5 0 0 0 0-1.032h-9.26v1.032h9.266zm-9.26 2.065v2.58h3.985c1.962 0 3.68-1.037 4.594-2.58zm0-5.162h8.584a5.33 5.33 0 0 0-4.593-2.58h-3.99z",
              fillRule: "evenodd",
              clipRule: "evenodd",
            },
          ],
        ],
      ],
      [
        "defs",
        {},
        [["clipPath", { id: "DAI__a" }, [["path", { fill: "#fff", d: "M0 0h24v24H0z" }]]]],
      ],
    ],
    shape: "circle",
  },
  WBT: {
    nodes: [
      ["path", { fill: "#F39200", d: "M24 0H0v24h24z" }],
      [
        "path",
        {
          fill: "none",
          stroke: "#ffffff",
          strokeWidth: "2.4",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          d: "M6 8l3.8 8.8 2.2-5.3 2.2 5.3 3.8-8.8",
        },
      ],
      ["circle", { cx: "12", cy: "5", r: "1.4", fill: "#ffffff" }],
    ],
    shape: "circle",
  },
  BTC: {
    nodes: [
      ["path", { fill: "#F7931A", d: "M24 0H0v24h24z" }],
      [
        "path",
        {
          fill: "#fff",
          d: "m16.14 10.15c.34-.84.44-1.74.22-2.61-.41-1.63-1.81-2.43-3.79-2.52V3.5h-1.64v1.44h-1.2V3.5h-1.64v1.5H5.8v1.8h1.22c.38 0 .61.21.61.57v8.52c0 .36-.23.57-.61.57H5.8v1.8h2.29v1.5h1.64v-1.44h1.2v1.44h1.64v-1.52c2.61-.17 4.41-1.16 4.67-3.48.16-1.42-.51-2.54-1.1-2.72zm-4.79-3.23c1.37 0 2.22.49 2.37 1.48.16 1.05-.62 1.68-2.03 1.68h-1.82V6.92h1.48zm.45 8.16H9.72v-3.48h2.08c1.55 0 2.45.65 2.3 1.83-.16 1.15-1.18 1.65-2.3 1.65z",
          fillRule: "evenodd",
          clipRule: "evenodd",
        },
      ],
    ],
    shape: "circle",
  },
} as unknown as Record<TokenSymbol, IconDef>

const CHAINS: Record<ChainId, IconDef> = {
  whitechain: {
    nodes: [
      ["path", { fill: "#121824", d: "M24 0H0v24h24z" }],
      [
        "path",
        {
          fill: "none",
          stroke: "#F39200",
          strokeWidth: "2.3",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          d: "M6 8.5l3.8 8.5 2.2-5.3 2.2 5.3 3.8-8.5",
        },
      ],
      ["circle", { cx: "12", cy: "5", r: "1.5", fill: "#F39200" }],
    ],
    shape: "circle",
  },
  archiv: {
    nodes: [
      ["path", { fill: "#059669", d: "M24 0H0v24h24z" }],
      [
        "path",
        {
          fill: "#047857",
          stroke: "#A7F3D0",
          strokeWidth: "1.2",
          strokeLinejoin: "round",
          d: "M12 5.5L18 8.9V15.1L12 18.5L6 15.1V8.9L12 5.5Z",
        },
      ],
      ["path", { fill: "#10B981", d: "M12 5.5L18 8.9L12 12.3L6 8.9L12 5.5Z" }],
      ["path", { fill: "#059669", d: "M12 12.3V18.5L6 15.1V8.9L12 12.3Z" }],
      ["path", { fill: "#047857", d: "M12 12.3L18 8.9V15.1L12 18.5V12.3Z" }],
      ["circle", { cx: "12", cy: "8.9", r: "1.3", fill: "#FFFFFF" }],
    ],
    shape: "circle",
  },
  monad: {
    nodes: [
      [
        "g",
        { clipPath: "url(#monad__a)" },
        [
          ["path", { fill: "#836EF9", d: "M24 0H0v24h24z" }],
          [
            "path",
            {
              fill: "#fff",
              d: "M12 4c-2.31 0-8 5.69-8 8s5.69 8 8 8 8-5.69 8-8-5.69-8-8-8m-1.247 12.575c-.974-.266-3.593-4.847-3.328-5.822s4.848-3.593 5.822-3.328 3.593 4.847 3.328 5.822-4.847 3.593-5.822 3.328",
            },
          ],
        ],
      ],
      [
        "defs",
        {},
        [["clipPath", { id: "monad__a" }, [["path", { fill: "#fff", d: "M0 0h24v24H0z" }]]]],
      ],
    ],
    shape: "circle",
  },
  ethereum: {
    nodes: [
      ["path", { fill: "#8FFCF3", d: "M12 3v6.651l5.625 2.516z" }],
      ["path", { fill: "#CABCF8", d: "m12 3-5.625 9.166L12 9.653z" }],
      ["path", { fill: "#CBA7F5", d: "M12 16.478V21l5.625-7.784z" }],
      ["path", { fill: "#74A0F3", d: "M12 21v-4.522l-5.625-3.262z" }],
      ["path", { fill: "#CBA7F5", d: "m12 15.43 5.625-3.263L12 9.652z" }],
      ["path", { fill: "#74A0F3", d: "M6.375 12.167 12 15.43V9.652z" }],
      [
        "path",
        {
          fill: "#202699",
          d: "m12 15.43-5.625-3.263L12 3l5.624 9.166zm-5.252-3.528 5.161-8.41v6.114zm-.077.229 5.238-2.327v5.364zm5.418-2.327v5.364l5.234-3.037zm0-.198 5.161 2.296-5.161-8.41z",
          fillRule: "evenodd",
          clipRule: "evenodd",
        },
      ],
      [
        "path",
        {
          fill: "#202699",
          d: "m12 16.406-5.625-3.195L12 21l5.624-7.79zm-4.995-2.633 4.904 2.79v4.005zm5.084 2.79v4.005l4.905-6.795z",
          fillRule: "evenodd",
          clipRule: "evenodd",
        },
      ],
    ],
    shape: "circle",
    surface: "#EEF0FF",
  },
  base: {
    nodes: [
      [
        "g",
        { clipPath: "url(#base__a)" },
        [
          ["path", { fill: "#00F", d: "M24 0H0v24h24z" }],
          [
            "path",
            {
              fill: "#fff",
              d: "M4 5.517c0-.52 0-.78.098-.98a.96.96 0 0 1 .44-.44C4.738 4 4.998 4 5.517 4h12.966c.52 0 .78 0 .98.098a.97.97 0 0 1 .439.44c.098.2.098.46.098.979v12.966c0 .52 0 .78-.098.98a.96.96 0 0 1-.44.439c-.2.098-.46.098-.979.098H5.517c-.52 0-.78 0-.98-.098a.96.96 0 0 1-.439-.44C4 19.263 4 19.002 4 18.484z",
            },
          ],
        ],
      ],
      [
        "defs",
        {},
        [["clipPath", { id: "base__a" }, [["path", { fill: "#fff", d: "M0 0h24v24H0z" }]]]],
      ],
    ],
    shape: "circle",
  },
  arbitrum: {
    nodes: [
      [
        "g",
        { clipPath: "url(#arbitrum-one__a)" },
        [
          ["path", { fill: "#213147", d: "M24 0H0v24h24z" }],
          [
            "path",
            {
              fill: "#fff",
              d: "m13.203 13.216-.787 2.124a.27.27 0 0 0 0 .183l1.354 3.655 1.565-.89-1.879-5.072c-.042-.117-.21-.117-.253 0m1.577-3.573a.135.135 0 0 0-.253 0l-.787 2.124a.27.27 0 0 0 0 .183l2.217 5.985 1.565-.89z",
            },
          ],
          [
            "path",
            {
              fill: "#fff",
              d: "M11.999 4.991a.24.24 0 0 1 .111.03l5.969 3.393a.22.22 0 0 1 .112.19v6.787a.22.22 0 0 1-.112.19l-5.969 3.395a.2.2 0 0 1-.111.029.24.24 0 0 1-.113-.03l-5.968-3.39a.22.22 0 0 1-.112-.19v-6.79a.22.22 0 0 1 .112-.19l5.969-3.393a.23.23 0 0 1 .111-.03m0-.991c-.213 0-.426.054-.616.163L5.416 7.556a1.21 1.21 0 0 0-.616 1.05v6.787c0 .433.234.834.616 1.05l5.968 3.394a1.25 1.25 0 0 0 1.232 0l5.968-3.394a1.21 1.21 0 0 0 .616-1.05V8.606a1.21 1.21 0 0 0-.616-1.05l-5.97-3.393A1.24 1.24 0 0 0 11.998 4",
            },
          ],
          [
            "path",
            {
              fill: "#fff",
              d: "m8.052 17.943.55-1.482 1.105.905-1.034.93zm3.445-9.823H9.984a.27.27 0 0 0-.254.175l-3.243 8.757 1.565.89L11.623 8.3a.132.132 0 0 0-.127-.179",
            },
          ],
          [
            "path",
            {
              fill: "#fff",
              d: "M14.144 8.12h-1.513a.27.27 0 0 0-.253.175l-3.704 10 1.565.89 4.032-10.886a.133.133 0 0 0-.127-.179",
            },
          ],
        ],
      ],
      [
        "defs",
        {},
        [
          [
            "clipPath",
            { id: "arbitrum-one__a" },
            [["path", { fill: "#fff", d: "M0 0h24v24H0z" }]],
          ],
        ],
      ],
    ],
    shape: "circle",
  },
} as unknown as Record<ChainId, IconDef>

const WALLETS: Record<WalletId, IconDef> = {
  metamask: {
    nodes: [
      [
        "path",
        {
          fill: "#FF5C16",
          d: "m19.821 19.918-3.877-1.131-2.924 1.712h-2.04l-2.926-1.712-3.875 1.13L3 16.02l1.179-4.327L3 8.034 4.179 3.5l6.056 3.544h3.53L19.821 3.5 21 8.034l-1.179 3.658L21 16.02z",
        },
      ],
      [
        "path",
        {
          fill: "#FF5C16",
          d: "m4.18 3.5 6.055 3.547-.24 2.434zm3.875 12.52 2.665 1.99-2.665.777zm2.452-3.286-.512-3.251-3.278 2.21h-.002v.001l.01 2.275 1.33-1.235zM19.82 3.5l-6.056 3.547.24 2.434zm-3.875 12.52-2.665 1.99 2.665.777zm1.339-4.326v-.002zl-3.279-2.21-.512 3.25h2.451l1.33 1.236z",
        },
      ],
      [
        "path",
        {
          fill: "#E34807",
          d: "m8.054 18.787-3.875 1.13L3 16.022h5.054zm2.452-6.054.74 4.7-1.026-2.614-3.497-.85 1.33-1.236zm5.44 6.054 3.875 1.13L21 16.022h-5.055zm-2.452-6.054-.74 4.7 1.026-2.614 3.497-.85-1.331-1.236z",
        },
      ],
      [
        "path",
        {
          fill: "#FF8D5D",
          d: "m3 16.02 1.179-4.328h2.535l.01 2.276 3.496.85 1.026 2.613-.527.576-2.665-1.989H3zm18 0-1.179-4.328h-2.535l-.01 2.276-3.496.85-1.026 2.613.527.576 2.665-1.989H21zm-7.235-8.976h-3.53l-.24 2.435 1.251 7.95h1.508l1.252-7.95z",
        },
      ],
      [
        "path",
        {
          fill: "#661800",
          d: "M4.179 3.5 3 8.034l1.179 3.658h2.535l3.28-2.211zm5.594 10.177H8.625l-.626.6 2.222.54zM19.821 3.5 21 8.034l-1.179 3.658h-2.535l-3.28-2.211zm-5.593 10.177h1.15l.626.6-2.224.541zm-1.209 5.271.262-.94-.527-.575h-1.509l-.527.575.262.94",
        },
      ],
      ["path", { fill: "#C0C4CD", d: "M13.02 18.948V20.5h-2.04v-1.552z" }],
      [
        "path",
        {
          fill: "#E7EBF6",
          d: "m8.055 18.785 2.927 1.714v-1.552l-.262-.94zm7.89 0L13.02 20.5v-1.552l.262-.94z",
        },
      ],
    ],
    shape: "none",
  },
  walletconnect: {
    nodes: [
      [
        "g",
        { clipPath: "url(#wallet-connect__a)" },
        [
          ["path", { fill: "#3B99FC", d: "M24 0H0v24h24z" }],
          [
            "path",
            {
              fill: "#fff",
              d: "M7.276 9.076c2.609-2.501 6.84-2.501 9.449 0l.313.3a.31.31 0 0 1 0 .453l-1.074 1.03a.17.17 0 0 1-.236 0l-.432-.414c-1.82-1.745-4.772-1.745-6.592 0l-.463.444a.17.17 0 0 1-.236 0l-1.074-1.03a.31.31 0 0 1 0-.453zm11.67 2.129.956.916a.31.31 0 0 1 0 .453l-4.31 4.132a.344.344 0 0 1-.473 0l-3.06-2.932a.086.086 0 0 0-.118 0l-3.06 2.932a.344.344 0 0 1-.472 0l-4.311-4.132a.31.31 0 0 1 0-.453l.956-.916a.344.344 0 0 1 .472 0l3.06 2.933a.086.086 0 0 0 .118 0l3.06-2.933a.344.344 0 0 1 .472 0l3.06 2.933a.086.086 0 0 0 .118 0l3.06-2.933a.345.345 0 0 1 .472 0",
            },
          ],
        ],
      ],
      [
        "defs",
        {},
        [
          [
            "clipPath",
            { id: "wallet-connect__a" },
            [["path", { fill: "#fff", d: "M0 0h24v24H0z" }]],
          ],
        ],
      ],
    ],
    shape: "squircle",
  },
  coinbase: {
    nodes: [
      [
        "g",
        { clipPath: "url(#coinbase__a)" },
        [
          ["path", { fill: "#0E5BFF", d: "M24 0H0v24h24z" }],
          [
            "path",
            {
              fill: "#fff",
              d: "M4 12a8 8 0 1 1 16 0 8 8 0 0 1-16 0",
            },
          ],
          [
            "path",
            {
              fill: "#0E5BFF",
              d: "M12 17.667a5.667 5.667 0 1 0 0-11.334 5.667 5.667 0 0 0 0 11.334m-.667-7.334a1 1 0 0 0-1 1v1.334a1 1 0 0 0 1 1h1.334a1 1 0 0 0 1-1v-1.334a1 1 0 0 0-1-1z",
              fillRule: "evenodd",
              clipRule: "evenodd",
            },
          ],
        ],
      ],
      [
        "defs",
        {},
        [["clipPath", { id: "coinbase__a" }, [["path", { fill: "#fff", d: "M0 0h24v24H0z" }]]]],
      ],
    ],
    shape: "squircle",
  },
} as unknown as Record<WalletId, IconDef>

function renderNodes(nodes: IconNode[]): ReactNode {
  return nodes.map(([Tag, attrs, children], index) => {
    const El = Tag as "path"
    return (
      <El key={index} {...attrs}>
        {children ? renderNodes(children) : null}
      </El>
    )
  })
}

export type IconProps = {
  size?: number
  className?: string
  /** Accessible name. Omit for purely decorative icons. */
  title?: string
}

function BrandIcon({
  def,
  size = 32,
  className = "",
  title,
}: IconProps & { def: IconDef }) {
  const radius =
    def.shape === "circle" ? "50%" : def.shape === "squircle" ? "24%" : undefined
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      className={`shrink-0 ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        minHeight: `${size}px`,
        borderRadius: radius,
        flexShrink: 0,
      }}
    >
      {title ? <title>{title}</title> : null}
      {def.surface ? <circle cx="12" cy="12" r="12" fill={def.surface} /> : null}
      {renderNodes(def.nodes)}
    </svg>
  )
}

export function TokenIcon({
  symbol,
  ...props
}: IconProps & { symbol: TokenSymbol }) {
  return <BrandIcon def={TOKENS[symbol]} {...props} />
}

export function ChainIcon({
  chain,
  ...props
}: IconProps & { chain: ChainId }) {
  return <BrandIcon def={CHAINS[chain]} {...props} />
}

export function WalletIcon({
  wallet,
  ...props
}: IconProps & { wallet: WalletId }) {
  return <BrandIcon def={WALLETS[wallet]} {...props} />
}

/** Standalone official Whitechain icon component */
export function WhitechainIcon({
  size = 20,
  className = "",
  title = "Whitechain",
}: IconProps) {
  return <ChainIcon chain="whitechain" size={size} className={className} title={title} />
}

/** Standalone official Archiv Web3 Database icon component */
export function ArchivIcon({
  size = 20,
  className = "",
  title = "Archiv Decentralized Web3 DB",
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      className={`shrink-0 ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        minHeight: `${size}px`,
        flexShrink: 0,
      }}
    >
      {title ? <title>{title}</title> : null}
      <circle cx="12" cy="12" r="12" fill="#059669" />
      {/* 3D Web3 Decentralized DB Cube */}
      <path
        d="M12 5.2L18.2 8.8V15.2L12 18.8L5.8 15.2V8.8L12 5.2Z"
        fill="#047857"
        stroke="#A7F3D0"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
      <path
        d="M12 5.2L18.2 8.8L12 12.4L5.8 8.8L12 5.2Z"
        fill="#10B981"
      />
      <path
        d="M12 12.4V18.8L5.8 15.2V8.8L12 12.4Z"
        fill="#059669"
      />
      <path
        d="M12 12.4L18.2 8.8V15.2L12 18.8V12.4Z"
        fill="#047857"
      />
      {/* Web3 Database query tier lines */}
      <path
        d="M8.6 12.8L12 14.8L15.4 12.8"
        stroke="#ECFDF5"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="8.8" r="1.3" fill="#FFFFFF" />
      <circle cx="8.6" cy="12.8" r="0.9" fill="#A7F3D0" />
      <circle cx="15.4" cy="12.8" r="0.9" fill="#A7F3D0" />
    </svg>
  )
}

/** Token icon with a small network badge, e.g. USDT on Whitechain. */
export function TokenChainIcon({
  symbol,
  chain,
  size = 40,
  className = "",
  title,
}: IconProps & { symbol: TokenSymbol; chain?: ChainId }) {
  const badge = Math.max(12, Math.round(size * 0.44))
  return (
    <span
      className={`relative inline-flex shrink-0 ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        minHeight: `${size}px`,
        flexShrink: 0,
      }}
    >
      <TokenIcon symbol={symbol} size={size} title={title} />
      {chain ? (
        <span
          className="absolute rounded-full bg-white flex items-center justify-center"
          style={{
            right: -Math.round(badge * 0.15),
            bottom: -Math.round(badge * 0.15),
            padding: 1.5,
            lineHeight: 0,
            boxShadow: "0 0 0 0.5px rgba(30, 20, 45, 0.15)",
          }}
        >
          <ChainIcon chain={chain} size={badge} />
        </span>
      ) : null}
    </span>
  )
}

const CHAIN_BY_NAME: Record<string, ChainId> = {
  whitechain: "whitechain",
  monad: "whitechain",
  ethereum: "ethereum",
  base: "base",
  arbitrum: "arbitrum",
  archiv: "archiv",
  arkiv: "archiv",
}

/** Maps a display name such as "Whitechain" or "Archiv" to a known chain id. */
export function toChainId(name: string): ChainId | undefined {
  return CHAIN_BY_NAME[name.toLowerCase()]
}

export function isTokenSymbol(value: string): value is TokenSymbol {
  return value in TOKENS
}
