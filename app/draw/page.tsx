"use client";

import { useState } from "react";
import { getDraw, createDraw, deleteDraw, Draw, getDrawStatistics, DrawStatistics } from "@/lib/api";
import { useFetch } from "@/hooks/useFetch";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import TeamAvatar from "@/components/TeamAvatar";
import { getFlag } from "@/lib/flags";
import Image from "next/image";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { HERO_BG, HERO_STARS, POT_CONFIG } from "@/lib/constants";
import { MESSAGES } from "@/lib/messages";

const ActionStatus = {
  IDLE: "idle",
  CREATING: "creating",
  DELETING: "deleting",
} as const;
type ActionStatus = typeof ActionStatus[keyof typeof ActionStatus];

export default function DrawPage() {
  const [fetchKey, setFetchKey] = useState(0);
  const [actionStatus, setActionStatus] = useState<ActionStatus>(ActionStatus.IDLE);

  const { loading: isLoading, data } = useFetch(
    () => Promise.all([getDraw(), getDrawStatistics()]).then(([d, s]) => ({ draw: d, stats: s })),
    [fetchKey]
  );

  const draw: Draw | null = data?.draw ?? null;
  const stats: DrawStatistics | null = data?.stats ?? null;

  function refresh() { setFetchKey((k) => k + 1); }

  async function handleCreate() {
    setActionStatus(ActionStatus.CREATING);
    try { await createDraw(); toast.success(MESSAGES.draw.createSuccess); refresh(); }
    catch (e) { toast.error(e instanceof Error ? e.message : MESSAGES.draw.createError); }
    finally { setActionStatus(ActionStatus.IDLE); }
  }

  async function handleDelete() {
    setActionStatus(ActionStatus.DELETING);
    try { await deleteDraw(); toast.success(MESSAGES.draw.deleteSuccess); refresh(); }
    catch (e) { toast.error(e instanceof Error ? e.message : MESSAGES.draw.deleteError); }
    finally { setActionStatus(ActionStatus.IDLE); }
  }

  const isActing = actionStatus !== ActionStatus.IDLE;

  return (
    <div className="flex flex-col flex-1">

      {/* ── Hero ── */}
      <div
        className="w-full py-12 px-4 relative overflow-hidden"
        style={{ background: HERO_BG }}
      >
        {/* Estrellas decorativas */}
        <div className="absolute inset-0 pointer-events-none select-none">
          {HERO_STARS.map((pos, i) => (
            <span key={i} className={`absolute text-yellow-400/25 animate-pulse ${pos}`}
              style={{ animationDelay: `${i * 0.3}s`, animationDuration: "2.5s", fontSize: i % 3 === 0 ? "18px" : "12px" }}>
              ★
            </span>
          ))}
        </div>

        {/* Starball decorativo de fondo */}
        <div className="absolute -right-8 top-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
          <Image src="/ucl-ball.png" alt="" width={240} height={229} className="object-contain invert" />
        </div>
        <div className="absolute -left-16 top-1/2 -translate-y-1/2 opacity-[0.04] pointer-events-none">
          <Image src="/ucl-ball.png" alt="" width={180} height={171} className="object-contain invert" />
        </div>

        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-8 relative z-10">

          {/* Branding */}
          <div className="flex items-center gap-5">
            {/* Starball animado */}
            <div className="relative shrink-0" style={{ animation: "ucl-bounce 3s ease-in-out infinite" }}>
              <Image src="/ucl-ball.png" alt="UCL" width={72} height={68} className="object-contain invert" />
            </div>
            <div>
              <p className="text-yellow-400/80 text-xs font-bold tracking-widest uppercase mb-1">{MESSAGES.header.uefa}</p>
              <h1 className="text-3xl font-black text-white tracking-tight leading-none">
                Champions <span className="text-yellow-400">League</span>
              </h1>
              <p className="text-blue-300/70 text-sm mt-1">{MESSAGES.draw.subtitle}</p>
              {draw && (
                <p className="text-white/40 text-xs mt-0.5">
                  Realizado el {new Date(draw.createdAt).toLocaleDateString("es-AR", { day: "2-digit", month: "long", year: "numeric" })}
                </p>
              )}
            </div>
          </div>

          {/* Stats + acción */}
          <div className="flex items-center gap-6">
            {draw && stats && (
              <div className="hidden sm:flex gap-5 text-center">
                {[
                  [String(Object.values(stats.teamsPerPot).reduce((a, b) => a + b, 0)), MESSAGES.draw.teamsLabel],
                  [String(Object.keys(stats.teamsPerPot).length), MESSAGES.draw.potsLabel],
                  [String(stats.totalMatches), MESSAGES.draw.matchesLabel],
                  [String(Object.keys(stats.matchesPerMatchDay).length), MESSAGES.draw.roundsLabel],
                ].map(([n, l]) => (
                  <div key={l}>
                    <p className="text-2xl font-black text-yellow-400">{n}</p>
                    <p className="text-xs text-blue-300/60">{l}</p>
                  </div>
                ))}
              </div>
            )}

            {!isLoading && !draw && (
              <Button onClick={handleCreate} disabled={isActing} size="lg"
                className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 font-bold shadow-lg shadow-yellow-400/20">
                {actionStatus === ActionStatus.CREATING ? MESSAGES.draw.creating : MESSAGES.draw.createButton}
              </Button>
            )}

            {!isLoading && draw && (
              <AlertDialog>
                <AlertDialogTrigger disabled={isActing}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium px-4 py-2 bg-white/10 text-white border border-white/20 hover:bg-white/20 disabled:opacity-50 transition-colors">
                  {actionStatus === ActionStatus.DELETING ? MESSAGES.draw.deleting : MESSAGES.draw.deleteButton}
                </AlertDialogTrigger>
                <AlertDialogContent
                  style={{ background: "#0d1e3a", border: "1px solid rgba(255,255,255,0.1)" }}
                  className="shadow-2xl shadow-black/50"
                >
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-white">{MESSAGES.draw.deleteConfirmTitle}</AlertDialogTitle>
                    <AlertDialogDescription className="text-blue-300/70">
                      {MESSAGES.draw.deleteConfirmDescription}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="border-t border-white/10 pt-4" style={{ background: "#0d1e3a" }}>
                    <AlertDialogCancel
                      className="bg-transparent text-blue-200 border-white/20 hover:bg-white/10 hover:text-white">
                      {MESSAGES.common.cancel}
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}
                      className="bg-red-600 text-white hover:bg-red-500 border-0">
                      {MESSAGES.draw.confirmDelete}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </div>

      {/* ── Contenido ── */}
      <div className="flex-1 w-full px-4 py-8 min-h-0" style={{ background: "#0d1e3a" }}>
        <div className="max-w-6xl mx-auto flex flex-col gap-6">

          {isLoading && (
            <div className="flex justify-center py-16">
              <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!isLoading && !draw && (
            <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
              <div style={{ animation: "ucl-bounce 2.5s ease-in-out infinite" }}>
                <Image src="/ucl-ball.png" alt="UCL" width={96} height={91} className="object-contain invert" />
              </div>
              <div>
                <p className="text-xl font-bold text-white">{MESSAGES.draw.noDrawTitle}</p>
                <p className="text-blue-300/60 mt-1 text-sm max-w-sm mx-auto">
                  {MESSAGES.draw.noDrawDescription}
                </p>
              </div>
            </div>
          )}

          {!isLoading && draw && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {draw.pots.map((pot) => {
                  const cfg = POT_CONFIG[pot.id];
                  return (
                    <div key={pot.id} className="rounded-xl overflow-hidden"
                      style={{ background: "#0a1628", border: `1px solid ${cfg.accent}22` }}>
                      {/* Header */}
                      <div className="px-4 py-3 flex items-center justify-between"
                        style={{ borderBottom: `1px solid ${cfg.accent}33`, background: `${cfg.accent}10` }}>
                        <span className="text-xs font-black tracking-widest uppercase px-2.5 py-1 rounded-full"
                          style={{ background: cfg.badgeBg, color: cfg.badgeText }}>
                          {cfg.label}
                        </span>
                        <span className="text-xs" style={{ color: `${cfg.accent}80` }}>{pot.teams.length} equipos</span>
                      </div>
                      {/* Filas */}
                      <div>
                        {pot.teams.map((team, i) => (
                          <Link key={team.id} href={`/teams/${team.id}`}
                            className="flex items-center gap-3 px-3 py-2.5 transition-colors group"
                            style={{
                              borderBottom: i < pot.teams.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                            }}
                            onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
                            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                          >
                            <div className="shrink-0 rounded-lg overflow-hidden flex items-center justify-center"
                              style={{ width: 40, height: 40, background: "rgba(255,255,255,0.92)", padding: 3 }}>
                              <TeamAvatar name={team.name} pot={pot.id} size="md" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-white truncate">{team.name}</p>
                              <p className="text-xs" style={{ color: "rgba(147,197,253,0.6)" }}>
                                {getFlag(team.country.name)} {team.country.name}
                              </p>
                            </div>
                            <span className="text-xs transition-colors shrink-0"
                              style={{ color: `${cfg.accent}50` }}>→</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-end">
                <Link href="/matches"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
                  style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}>
                  {MESSAGES.nav.viewAllMatches}
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes ucl-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}
