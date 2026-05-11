DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;

DROP POLICY IF EXISTS "Anyone can view available pets" ON public.pets;
DROP POLICY IF EXISTS "Admins can insert pets" ON public.pets;
DROP POLICY IF EXISTS "Admins can update pets" ON public.pets;
DROP POLICY IF EXISTS "Admins can delete pets" ON public.pets;

CREATE POLICY "Anyone can view available pets"
  ON public.pets FOR SELECT
  USING (
    status = 'available'
    OR EXISTS (
      SELECT 1
      FROM public.user_roles
      WHERE user_id = auth.uid()
        AND role = 'admin'::public.app_role
    )
  );

CREATE POLICY "Admins can insert pets"
  ON public.pets FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.user_roles
      WHERE user_id = auth.uid()
        AND role = 'admin'::public.app_role
    )
  );

CREATE POLICY "Admins can update pets"
  ON public.pets FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.user_roles
      WHERE user_id = auth.uid()
        AND role = 'admin'::public.app_role
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.user_roles
      WHERE user_id = auth.uid()
        AND role = 'admin'::public.app_role
    )
  );

CREATE POLICY "Admins can delete pets"
  ON public.pets FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.user_roles
      WHERE user_id = auth.uid()
        AND role = 'admin'::public.app_role
    )
  );

DROP POLICY IF EXISTS "Admins can upload pet photos" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update pet photos" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete pet photos" ON storage.objects;

CREATE POLICY "Admins can upload pet photos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'pet-photos'
    AND EXISTS (
      SELECT 1
      FROM public.user_roles
      WHERE user_id = auth.uid()
        AND role = 'admin'::public.app_role
    )
  );

CREATE POLICY "Admins can update pet photos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'pet-photos'
    AND EXISTS (
      SELECT 1
      FROM public.user_roles
      WHERE user_id = auth.uid()
        AND role = 'admin'::public.app_role
    )
  )
  WITH CHECK (
    bucket_id = 'pet-photos'
    AND EXISTS (
      SELECT 1
      FROM public.user_roles
      WHERE user_id = auth.uid()
        AND role = 'admin'::public.app_role
    )
  );

CREATE POLICY "Admins can delete pet photos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'pet-photos'
    AND EXISTS (
      SELECT 1
      FROM public.user_roles
      WHERE user_id = auth.uid()
        AND role = 'admin'::public.app_role
    )
  );

REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM anon, authenticated, public;