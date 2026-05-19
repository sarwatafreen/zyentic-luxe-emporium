grant execute on function public.has_role(uuid, public.app_role) to anon, authenticated;

comment on function public.has_role(uuid, public.app_role) is 'Security definer helper used by row-level access rules to check whether a user has a specific app role.';