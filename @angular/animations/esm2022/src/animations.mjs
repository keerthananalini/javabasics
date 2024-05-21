/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @module
 * @description
 * Entry point for all animation APIs of the animation package.
 */
export { AnimationBuilder, AnimationFactory } from './animation_builder';
export { animate, animateChild, animation, AnimationMetadataType, AUTO_STYLE, group, keyframes, query, sequence, stagger, state, style, transition, trigger, useAnimation, } from './animation_metadata';
export { NoopAnimationPlayer } from './players/animation_player';
export * from './private_export';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2FuaW1hdGlvbnMvc3JjL2FuaW1hdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUg7Ozs7R0FJRztBQUNILE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBRXZFLE9BQU8sRUFDTCxPQUFPLEVBQ1AsWUFBWSxFQUdaLFNBQVMsRUFPVCxxQkFBcUIsRUFXckIsVUFBVSxFQUNWLEtBQUssRUFDTCxTQUFTLEVBQ1QsS0FBSyxFQUNMLFFBQVEsRUFDUixPQUFPLEVBQ1AsS0FBSyxFQUNMLEtBQUssRUFDTCxVQUFVLEVBQ1YsT0FBTyxFQUNQLFlBQVksR0FHYixNQUFNLHNCQUFzQixDQUFDO0FBQzlCLE9BQU8sRUFBa0IsbUJBQW1CLEVBQUMsTUFBTSw0QkFBNEIsQ0FBQztBQUVoRixjQUFjLGtCQUFrQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbi8qKlxuICogQG1vZHVsZVxuICogQGRlc2NyaXB0aW9uXG4gKiBFbnRyeSBwb2ludCBmb3IgYWxsIGFuaW1hdGlvbiBBUElzIG9mIHRoZSBhbmltYXRpb24gcGFja2FnZS5cbiAqL1xuZXhwb3J0IHtBbmltYXRpb25CdWlsZGVyLCBBbmltYXRpb25GYWN0b3J5fSBmcm9tICcuL2FuaW1hdGlvbl9idWlsZGVyJztcbmV4cG9ydCB7QW5pbWF0aW9uRXZlbnR9IGZyb20gJy4vYW5pbWF0aW9uX2V2ZW50JztcbmV4cG9ydCB7XG4gIGFuaW1hdGUsXG4gIGFuaW1hdGVDaGlsZCxcbiAgQW5pbWF0ZUNoaWxkT3B0aW9ucyxcbiAgQW5pbWF0ZVRpbWluZ3MsXG4gIGFuaW1hdGlvbixcbiAgQW5pbWF0aW9uQW5pbWF0ZUNoaWxkTWV0YWRhdGEsXG4gIEFuaW1hdGlvbkFuaW1hdGVNZXRhZGF0YSxcbiAgQW5pbWF0aW9uQW5pbWF0ZVJlZk1ldGFkYXRhLFxuICBBbmltYXRpb25Hcm91cE1ldGFkYXRhLFxuICBBbmltYXRpb25LZXlmcmFtZXNTZXF1ZW5jZU1ldGFkYXRhLFxuICBBbmltYXRpb25NZXRhZGF0YSxcbiAgQW5pbWF0aW9uTWV0YWRhdGFUeXBlLFxuICBBbmltYXRpb25PcHRpb25zLFxuICBBbmltYXRpb25RdWVyeU1ldGFkYXRhLFxuICBBbmltYXRpb25RdWVyeU9wdGlvbnMsXG4gIEFuaW1hdGlvblJlZmVyZW5jZU1ldGFkYXRhLFxuICBBbmltYXRpb25TZXF1ZW5jZU1ldGFkYXRhLFxuICBBbmltYXRpb25TdGFnZ2VyTWV0YWRhdGEsXG4gIEFuaW1hdGlvblN0YXRlTWV0YWRhdGEsXG4gIEFuaW1hdGlvblN0eWxlTWV0YWRhdGEsXG4gIEFuaW1hdGlvblRyYW5zaXRpb25NZXRhZGF0YSxcbiAgQW5pbWF0aW9uVHJpZ2dlck1ldGFkYXRhLFxuICBBVVRPX1NUWUxFLFxuICBncm91cCxcbiAga2V5ZnJhbWVzLFxuICBxdWVyeSxcbiAgc2VxdWVuY2UsXG4gIHN0YWdnZXIsXG4gIHN0YXRlLFxuICBzdHlsZSxcbiAgdHJhbnNpdGlvbixcbiAgdHJpZ2dlcixcbiAgdXNlQW5pbWF0aW9uLFxuICDJtVN0eWxlRGF0YSxcbiAgybVTdHlsZURhdGFNYXAsXG59IGZyb20gJy4vYW5pbWF0aW9uX21ldGFkYXRhJztcbmV4cG9ydCB7QW5pbWF0aW9uUGxheWVyLCBOb29wQW5pbWF0aW9uUGxheWVyfSBmcm9tICcuL3BsYXllcnMvYW5pbWF0aW9uX3BsYXllcic7XG5cbmV4cG9ydCAqIGZyb20gJy4vcHJpdmF0ZV9leHBvcnQnO1xuIl19