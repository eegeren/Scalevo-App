"use client";

import { useEffect } from "react";
import { useLang } from "@/lib/context/LanguageContext";
import { translateText } from "@/lib/i18n/runtime";

const originalTextByNode = new WeakMap<Text, string>();

function shouldSkipTextNode(node: Text) {
  const parent = node.parentElement;
  if (!parent) return true;
  if (["SCRIPT", "STYLE", "NOSCRIPT"].includes(parent.tagName)) return true;
  if (parent.closest("script, style, noscript")) return true;
  if (parent.closest("input, textarea")) return true;
  return !node.textContent?.trim();
}

function translateNodeText(node: Text, lang: "tr" | "en") {
  if (shouldSkipTextNode(node)) return;

  const original = originalTextByNode.get(node) ?? node.textContent ?? "";
  if (!originalTextByNode.has(node)) {
    originalTextByNode.set(node, original);
  }

  const leading = original.match(/^\s*/)?.[0] ?? "";
  const trailing = original.match(/\s*$/)?.[0] ?? "";
  const core = original.trim();
  const translated = lang === "en" ? translateText(core, "en") : core;
  node.textContent = `${leading}${translated}${trailing}`;
}

function translateAttributes(root: ParentNode, lang: "tr" | "en") {
  const elements =
    root instanceof Element
      ? [root, ...Array.from(root.querySelectorAll("*"))]
      : Array.from((root as Document).querySelectorAll("*"));

  for (const element of elements) {
    for (const attr of ["placeholder", "title", "aria-label"]) {
      const current = element.getAttribute(attr);
      if (!current) continue;

      const storeKey = `data-scalevo-orig-${attr}`;
      const original = element.getAttribute(storeKey) ?? current;
      if (!element.hasAttribute(storeKey)) {
        element.setAttribute(storeKey, original);
      }

      element.setAttribute(attr, lang === "en" ? translateText(original, "en") : original);
    }

    if (element instanceof HTMLInputElement && ["button", "submit", "reset"].includes(element.type)) {
      const original = element.dataset.scalevoOrigValue ?? element.value;
      if (!element.dataset.scalevoOrigValue) {
        element.dataset.scalevoOrigValue = original;
      }
      element.value = lang === "en" ? translateText(original, "en") : original;
    }
  }
}

function syncTree(root: ParentNode, lang: "tr" | "en") {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let current = walker.nextNode();
  while (current) {
    translateNodeText(current as Text, lang);
    current = walker.nextNode();
  }

  translateAttributes(root, lang);
}

export default function LanguageSync() {
  const { lang } = useLang();

  useEffect(() => {
    document.documentElement.lang = lang;
    syncTree(document.body, lang);

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE) {
            translateNodeText(node as Text, lang);
          }
          if (node.nodeType === Node.ELEMENT_NODE) {
            syncTree(node as ParentNode, lang);
          }
        });
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [lang]);

  return null;
}
