
import MOD_REGISTRY from "https://cdn.parallaxstudios.xyz/mods.json";
export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === "/updater") {
      return handleUpdater(url.searchParams);
    }

    // Fallback for unknown routes
    return new Response(JSON.stringify({ error: "Unknown endpoint." }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  },
};
function handleUpdater(params) {
  const modId = params.get("mod");
  const localVersion = params.get("localver");
  if (!modId || !localVersion) {
    return jsonResponse(
      { error: "Missing required parameters: mod, localver" },
      400
    );
  }
  const mod = MOD_REGISTRY[modId];
  if (!mod) {
    return jsonResponse({ error: `Mod '${modId}' not found in registry.` }, 404);
  }

  const updateAvailable = mod.latest_version !== localVersion;

  return jsonResponse({
    mod: modId,
    local_version: localVersion,
    latest_version: mod.latest_version,
    update_available: updateAvailable,
    ...(updateAvailable && {
      download_url: mod.download_url,
      changelog: mod.changelog,
      mc_version: mod.mc_version,
    }),
  });
}
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
