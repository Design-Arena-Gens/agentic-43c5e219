const OrderCard = ({ order }) => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div>
        <h3 className="text-lg font-semibold">Order #{order.orderNumber}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Placed on {new Date(order.createdAt).toLocaleDateString()} • {order.status}
        </p>
      </div>
      <div className="text-right">
        <p className="text-sm text-slate-500 dark:text-slate-400">Total</p>
        <p className="text-xl font-bold text-primary">${order.total.toFixed(2)}</p>
      </div>
    </div>
    <div className="space-y-3">
      {order.items.map((item) => (
        <div key={item._id} className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden">
              {item.product?.image ? (
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400">
                  No image
                </div>
              )}
            </div>
            <div>
              <p className="font-medium">{item.product?.name || 'Product removed'}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Qty {item.quantity}</p>
            </div>
          </div>
          <span className="font-semibold">${item.price.toFixed(2)}</span>
        </div>
      ))}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 pt-3">
        <span>Subtotal</span>
        <span>${order.subtotal.toFixed(2)}</span>
      </div>
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>Shipping</span>
        <span>${order.shipping.toFixed(2)}</span>
      </div>
    </div>
  </div>
);

export default OrderCard;
