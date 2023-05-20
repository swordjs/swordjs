#[macro_export]
macro_rules! CFUNC_DEF {
    ($name:expr,$func:ident,$len:expr) => {
        JSCFunctionListEntry {
            name: $name.as_ptr() as *const i8,
            prop_flags: (JS_PROP_WRITABLE | JS_PROP_CONFIGURABLE) as u8,
            def_type: JS_DEF_CFUNC as u8,
            magic: 0,
            u: JSCFunctionListEntry__bindgen_ty_1 {
                func: JSCFunctionListEntry__bindgen_ty_1__bindgen_ty_1 {
                    length: $len,
                    cproto: JSCFunctionEnum_JS_CFUNC_generic as u8,
                    cfunc: JSCFunctionType {
                        generic: Some($func),
                    },
                },
            },
        }
    };
}

#[macro_export]
macro_rules! CFUNC_MAGIC_DEF {
    ($name:expr,$func:ident,$len:expr,$magic:expr) => {
        JSCFunctionListEntry {
            name: $name.as_ptr() as *const i8,
            prop_flags: (JS_PROP_WRITABLE | JS_PROP_CONFIGURABLE) as u8,
            def_type: JS_DEF_CFUNC as u8,
            magic: $magic,
            u: JSCFunctionListEntry__bindgen_ty_1 {
                func: JSCFunctionListEntry__bindgen_ty_1__bindgen_ty_1 {
                    length: $len,
                    cproto: JSCFunctionEnum_JS_CFUNC_generic_magic as u8,
                    cfunc: JSCFunctionType {
                        generic_magic: Some($func),
                    },
                },
            },
        }
    };
}

#[macro_export]
macro_rules! JS_CGETSET_DEF {
    ($name:expr,$get:ident,$set:ident) => {
        JSCFunctionListEntry {
            name: $name.as_ptr() as *const i8,
            prop_flags: JS_PROP_CONFIGURABLE as u8,
            def_type: JS_DEF_CGETSET as u8,
            magic: 0,
            u: JSCFunctionListEntry__bindgen_ty_1 {
                getset: JSCFunctionListEntry__bindgen_ty_1__bindgen_ty_2 {
                    get: JSCFunctionType { getter: Some($get) },
                    set: JSCFunctionType { setter: Some($set) },
                },
            },
        }
    };
}

#[macro_export]
macro_rules! assert_size_zero {
    ($t:tt) => {{
        struct AssertSize<F: Fn(&mut Context, JsValue, &[JsValue]) -> JsValue>(PhantomData<F>);
        impl<F: Fn(&mut Context, JsValue, &[JsValue]) -> JsValue> AssertSize<F> {
            const ASSERT: [(); 1] = [()];
            const F_SIZE_MUST_ZERO: () = Self::ASSERT[std::mem::size_of::<F>()];
        }

        let _ = AssertSize::<$t>::F_SIZE_MUST_ZERO;
    }};
    ($d:tt,$t:tt) => {{
        struct AssertSize<D: Sized, F: Fn(&mut D, &mut Context, &[JsValue]) -> JsValue>(
            PhantomData<D>,
            PhantomData<F>,
        );
        impl<D: Sized, F: Fn(&mut D, &mut Context, &[JsValue]) -> JsValue> AssertSize<D, F> {
            const ASSERT: [(); 1] = [()];
            const F_SIZE_MUST_ZERO: () = Self::ASSERT[std::mem::size_of::<F>()];
        }

        let _ = AssertSize::<$d, $t>::F_SIZE_MUST_ZERO;
    }};
    ($d:tt,$getter:tt,$setter:tt) => {{
        struct AssertSize<
            D: Sized,
            Getter: Fn(&D, &mut Context) -> JsValue,
            Setter: Fn(&mut D, &mut Context, JsValue),
        >(PhantomData<(D, Getter, Setter)>);
        impl<D: Sized, Getter, Setter> AssertSize<D, Getter, Setter>
        where
            Getter: Fn(&D, &mut Context) -> JsValue,
            Setter: Fn(&mut D, &mut Context, JsValue),
        {
            const ASSERT: [(); 1] = [()];
            const GETTER_SETTER_SIZE_MUST_ZERO: () =
                Self::ASSERT[std::mem::size_of::<Getter>() + std::mem::size_of::<Setter>()];
        }

        let _ = AssertSize::<$d, $getter, $setter>::GETTER_SETTER_SIZE_MUST_ZERO;
    }};
    (@module,$t:tt) => {{
        struct AssertSize<F: Fn(&mut Context, &mut JsModuleDef)>(PhantomData<F>);
        impl<F: Fn(&mut Context, &mut JsModuleDef)> AssertSize<F> {
            const ASSERT: [(); 1] = [()];
            const F_SIZE_MUST_ZERO: () = Self::ASSERT[std::mem::size_of::<F>()];
        }

        let _ = AssertSize::<$t>::F_SIZE_MUST_ZERO;
    }};
}
