import type { Vec3 } from './island'

export type SceneMode = 'day' | 'night'

export interface EnvironmentPalette {
  skyTop: string
  skyHorizon: string
  sunColor: string
  moonColor: string
  fog: string
  sunLight: string
  sunIntensity: number
  fillLight: string
  fillIntensity: number
  hemiSky: string
  hemiGround: string
  hemiIntensity: number
  ambient: string
  ambientIntensity: number
  oceanDeep: string
  oceanShallow: string
  oceanLagoon: string
  oceanFoam: string
  oceanSky: string
  townLight: string
}

export const DAY_PALETTE: EnvironmentPalette = {
  skyTop: '#3f9fd0',
  skyHorizon: '#d9eef4',
  sunColor: '#fff3d6',
  moonColor: '#cfe0ff',
  fog: '#d8edf2',
  sunLight: '#fff0d2',
  sunIntensity: 2.4,
  fillLight: '#d8edf2',
  fillIntensity: 0.35,
  hemiSky: '#cfe8ff',
  hemiGround: '#6d5c40',
  hemiIntensity: 0.7,
  ambient: '#ffe9c9',
  ambientIntensity: 0.22,
  oceanDeep: '#0a4a59',
  oceanShallow: '#10949a',
  oceanLagoon: '#5cd9ca',
  oceanFoam: '#eaf7f4',
  oceanSky: '#c9e9f2',
  townLight: '#ffb45e',
}

export const NIGHT_PALETTE: EnvironmentPalette = {
  skyTop: '#050c1a',
  skyHorizon: '#1d3b52',
  sunColor: '#ffd9a0',
  moonColor: '#dce8ff',
  fog: '#0d2231',
  sunLight: '#a9c9f2',
  sunIntensity: 1.15,
  fillLight: '#2f5474',
  fillIntensity: 0.28,
  hemiSky: '#34526e',
  hemiGround: '#101a16',
  hemiIntensity: 0.5,
  ambient: '#9fbfe0',
  ambientIntensity: 0.28,
  oceanDeep: '#052330',
  oceanShallow: '#0d5560',
  oceanLagoon: '#1b8a8a',
  oceanFoam: '#bcd8d6',
  oceanSky: '#123246',
  townLight: '#ffb45e',
}

/** Arah matahari (dipakai juga oleh shader laut & sky dome). */
export const SUN_DIRECTION: Vec3 = [14, 18, 9]
export const MOON_DIRECTION: Vec3 = [9, 16, 12]
