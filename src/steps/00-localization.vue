<script setup lang="ts">
import { useInstallerStepper } from "../composables/useStepper";
import { readTextFileLines } from "@tauri-apps/plugin-fs";

useWindowTitle({
  title: "Bem-vindo ao Arch Linux",
  titleTemplate: (title) => title,
});

const language = ref("pt_BR");
const keymap = ref("br-abnt2");
const useSameKeymap = ref(true);

const languages = ref<Array<{ code: string; title: string }>>([]);

const { nextLink } = useInstallerStepper();

nextLink.value = "/01-try";

readTextFileLines("/etc/locale.gen").then(async (rows) => {
  const regex = /^#?\s*([a-z]{2}_[A-Z]{2}).UTF-8/gm;
  languages.value = [];
  for await (const line of rows) {
    const lang = regex.exec(line);
    if (!lang) {
      continue;
    }
    const normalizedCode = lang[1].replace("_", "-");

    languages.value.push({
      code: lang[1],
      title:
        new Intl.DisplayNames([normalizedCode], {
          type: "language",
        }).of(normalizedCode) ?? lang[1],
    });
  }
  languages.value.sort((a, b) => a.title.localeCompare(b.title));
});

async function readKeymaps() {
  return `3l
ANSI-dvorak
adnw
amiga-de
amiga-us
apple-a1048-sv
apple-a1243-sv
apple-a1243-sv-fn-reverse
apple-internal-0x0253-sv
apple-internal-0x0253-sv-fn-reverse
applkey
atari-de
atari-se
atari-uk-falcon
atari-us
azerty
backspace
bashkir
be-latin1
bg-cp1251
bg-cp855
bg_bds-cp1251
bg_bds-utf8
bg_pho-cp1251
bg_pho-utf8
bone
br-abnt
br-abnt2
br-latin1-abnt2
br-latin1-us
by
by-cp1251
bywin-cp1251
ca
carpalx
carpalx-full
cf
colemak
croat
ctrl
cz
cz-cp1250
cz-lat2
cz-lat2-prog
cz-qwertz
cz-us-qwertz
de
de-latin1
de-latin1-nodeadkeys
de-mobii
de_CH-latin1
de_alt_UTF-8
defkeymap
defkeymap_V1.0
dk
dk-latin1
dvorak
dvorak-ca-fr
dvorak-de
dvorak-es
dvorak-fr
dvorak-l
dvorak-la
dvorak-no
dvorak-programmer
dvorak-r
dvorak-ru
dvorak-sv-a1
dvorak-sv-a5
dvorak-uk
dvorak-ukp
emacs
emacs2
en
es
es-cp850
es-olpc
et
et-nodeadkeys
euro
euro1
euro2
fa
fi
fr
fr-bepo
fr-bepo-latin9
fr-latin1
fr-latin9
fr-pc
fr_CH
fr_CH-latin1
gr
gr-pc
hu
hu101
ie
il
il-heb
il-phonetic
is-latin1
is-latin1-us
it
it-ibm
it2
jp106
kazakh
keypad
koy
ky_alt_sh-UTF-8
kyrgyz
la-latin1
lt
lt.baltic
lt.l4
lv
lv-tilde
mac-be
mac-de-latin1
mac-de-latin1-nodeadkeys
mac-de_CH
mac-dk-latin1
mac-dvorak
mac-es
mac-euro
mac-euro2
mac-fi-latin1
mac-fr
mac-fr-legacy
mac-fr_CH-latin1
mac-it
mac-no-latin1
mac-pl
mac-pt-latin1
mac-se
mac-template
mac-uk
mac-us
mk
mk-cp1251
mk-utf
mk0
mod-dh-ansi-us
mod-dh-ansi-us-awing
mod-dh-ansi-us-fatz
mod-dh-ansi-us-fatz-wide
mod-dh-ansi-us-wide
mod-dh-iso-uk
mod-dh-iso-uk-wide
mod-dh-iso-us
mod-dh-iso-us-wide
mod-dh-matrix-us
neo
neoqwertz
nl
nl2
no
no-latin1
pc110
pl
pl1
pl2
pl3
pl4
pt-latin1
pt-latin9
pt-olpc
ro
ro_std
ro_win
ru
ru-cp1251
ru-ms
ru-yawerty
ru1
ru2
ru3
ru4
ru_win
ruwin_alt-CP1251
ruwin_alt-KOI8-R
ruwin_alt-UTF-8
ruwin_alt_sh-UTF-8
ruwin_cplk-CP1251
ruwin_cplk-KOI8-R
ruwin_cplk-UTF-8
ruwin_ct_sh-CP1251
ruwin_ct_sh-KOI8-R
ruwin_ct_sh-UTF-8
ruwin_ctrl-CP1251
ruwin_ctrl-KOI8-R
ruwin_ctrl-UTF-8
se-fi-ir209
se-fi-lat6
se-ir209
se-lat6
sg
sg-latin1
sg-latin1-lk450
sk-prog-qwerty
sk-prog-qwertz
sk-qwerty
sk-qwertz
slovene
sr-cy
sr-latin
sun-pl
sun-pl-altgraph
sundvorak
sunkeymap
sunt4-es
sunt4-fi-latin1
sunt4-no-latin1
sunt5-cz-us
sunt5-de-latin1
sunt5-es
sunt5-fi-latin1
sunt5-fr-latin1
sunt5-ru
sunt5-uk
sunt5-us-cz
sunt6-uk
sv-latin1
tj_alt-UTF8
tr_f-latin5
tr_q-latin5
tralt
trf
trf-fgGIod
trq
ttwin_alt-UTF-8
ttwin_cplk-UTF-8
ttwin_ct_sh-UTF-8
ttwin_ctrl-UTF-8
ua
ua-cp1251
ua-utf
ua-utf-ws
ua-ws
uk
unicode
us
us-acentos
us1
wangbe
wangbe2
windowkeys`;
}
</script>

<template>
  <ImageContent class="h-full">
    <h1 class="text-6 font-bold">Bem-vindo ao instalador do Arch Linux</h1>
    <p class="opacity-82 mb-4">
      Selecione o idioma e o layout do teclado que deseja usar durante a
      instalação.
    </p>

    <div class="flex gap-4 flex-col max-w-480px">
      <label>
        <p>Idioma</p>
        <select v-model="language" class="w-full">
          <option v-for="lang in languages" :value="lang.code">
            {{ lang.title }}
          </option>
        </select>
      </label>

      <label>
        <p>Layout do Teclado</p>
        <select v-model="keymap" class="w-full">
          <option value="br-abnt2">Português (Brasil - ABNT2)</option>
          <option value="us">English (US)</option>
          <option value="es">Español (España)</option>
          <option value="fr">Français (France)</option>
        </select>
      </label>

      <label class="flex gap-1 items-start">
        <input class="mt-1" type="checkbox" v-model="useSameKeymap" />
        <p>
          Utilizar essa configuração de idioma e layout de teclado para o
          sistema instalado
        </p>
      </label>
    </div>
  </ImageContent>
</template>
