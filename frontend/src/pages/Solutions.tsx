import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

interface Product {
  id: number;
  slug: string;
  name: string;
  description?: string;
  category: string | null;
  available: boolean;
  order?: number;
  images?: ProductImage[];
}

interface ProductImage {
  id: number;
  url: string | null;
  alt?: string | null;
  order?: number | null;
}

interface ProductDetail extends Product {
  specs?: string | null;
  created_at?: string;
  updated_at?: string;
  images?: ProductImage[];
}

export default function Solutions() {
  const { slug } = useParams<{ slug: string }>();
  const [products, setItems] = useState<ProductDetail[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [, setProductDetail] = useState<ProductDetail | null>(null);
  const [detailStatus, setDetailStatus] = useState<
    "idle" | "loading" | "ready" | "error"
  >("idle");
  const [detailError, setDetailError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");
    axios
      .get<Product[]>(`${import.meta.env.VITE_API_URL}/items/`, {
        signal: controller.signal,
      })
      .then(async (res) => {
        try {
          const productsWithImages = await Promise.all(
            res.data.map(async (product) => {
              try {
                const detail = await axios.get<ProductDetail>(
                  `${import.meta.env.VITE_API_URL}/items/${product.slug}/`,
                  { signal: controller.signal },
                );
                return { ...product, images: detail.data.images };
              } catch (error) {
                if (axios.isCancel(error)) {
                  throw error;
                }
                console.error(
                  `Unable to load images for product ${product.slug}`,
                  error,
                );
                return product;
              }
            }),
          );

          setItems(productsWithImages);
          setStatus("ready");
        } catch (error) {
          if (axios.isCancel(error)) {
            return;
          }
          console.error("Unable to load product images", error);
          setItems(res.data);
          setStatus("ready");
        }
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          return;
        }
        console.error("Unable to load products", err);
        setErrorMessage("We couldn’t sync the fleet catalog. Try again soon.");
        setStatus("error");
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!slug) {
      return;
    }

    const controller = new AbortController();
    setDetailStatus("loading");
    setDetailError(null);
    setProductDetail(null);

    axios
      .get<ProductDetail>(`${import.meta.env.VITE_API_URL}/items/${slug}/`, {
        signal: controller.signal,
      })
      .then((res) => {
        setProductDetail(res.data);
        setDetailStatus("ready");
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          return;
        }
        console.error("Unable to load product detail", err);
        setDetailError("Couldn't load product data.");
        setDetailStatus("error");
      });

    return () => controller.abort();
  }, [slug]);

  return (
    <main className="">
      <section className="">
        <div className="relative">
          <video
            autoPlay
            loop
            muted
            playsInline
            controls={false}
            controlsList="nodownload noplaybackrate noremoteplayback"
            disablePictureInPicture
            onContextMenu={(e) => e.preventDefault()}
            preload="none"
            src="/solutions-video.mp4"
            className="absolute inset-0 -z-1 h-screen w-full object-cover"
          ></video>

          <div className="container flex h-screen items-center justify-center">
            <h1 className="text-center text-6xl leading-12 font-bold max-lg:text-5xl max-md:max-w-xs max-md:text-4xl lg:leading-16">
              Field-Proven UAV, UGV & GCS Solutions
            </h1>
          </div>
        </div>
        <div>
          {products
            ?.filter((product) => product.order)
            .map((product) => {
              const image = product.images?.[0]?.url;
              return (
                <div key={product.id ?? product.slug}>
                  <div className="h-px w-full bg-gray-200"></div>
                  <div
                    className={`relative space-y-6 ${
                      image ? "bg-cover bg-center py-64 max-lg:py-32" : ""
                    }`}
                    style={
                      image ? { backgroundImage: `url(${image})` } : undefined
                    }
                  >
                    {image && (
                      <div className="pointer-events-none absolute inset-0 h-full bg-black/60" />
                    )}

                    <div className="relative z-10 container space-y-6">
                      <div className="space-y-1">
                        <h1 className="text-4xl font-bold text-white max-md:text-3xl">
                          {product.name}
                        </h1>

                        <p className="text-4xl tracking-widest text-white/90 uppercase max-md:text-3xl">
                          {product.category}
                        </p>
                      </div>

                      <Link
                        to={`/products/${product.slug}`}
                        className="group relative inline-flex h-12 w-48 items-center justify-center overflow-hidden rounded-2xl bg-white text-lg font-bold tracking-wide text-black uppercase transition-all duration-300 ease-out will-change-transform hover:shadow-[inset_0_3px_12px_rgba(255,255,255,0.35),inset_0_-6px_20px_rgba(0,0,0,0.45)] active:scale-[0.93] active:shadow-[inset_0_1px_6px_rgba(255,255,255,0.5),inset_0_-8px_22px_rgba(0,0,0,0.65)] max-md:text-base"
                      >
                        Learn more
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
        {status === "error" ? (
          <div className="mx-auto max-w-3xl rounded-3xl border border-red-500/50 bg-red-500/10 p-5 text-center text-sm text-red-200">
            {errorMessage ??
              "We couldn’t sync the fleet catalog. Try again soon."}
          </div>
        ) : null}
        {detailStatus === "error" && detailError ? (
          <div className="mx-auto max-w-3xl rounded-3xl border border-amber-400/60 bg-amber-500/10 p-5 text-center text-sm text-amber-100">
            {detailError}
          </div>
        ) : null}
      </section>
    </main>
  );
}
