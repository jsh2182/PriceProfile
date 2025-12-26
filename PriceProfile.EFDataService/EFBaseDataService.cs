using PriceProfile.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Reflection;

namespace PriceProfile.EFDataService
{
    public abstract class EFBaseDataService<TModel, TSchema, TKey> where TModel : class, new() where TSchema : class
    {
        public PriceProfileContext Context { get; set; }
        public DbSet<TModel> Current { get; set; }

        public abstract System.Linq.Expressions.Expression<Func<TModel, TKey>> GetKey();

        public EFBaseDataService(PriceProfileContext Context)
        {
            this.Context = Context;

            ((IObjectContextAdapter)Context).ObjectContext.CommandTimeout = 0;

            this.Current = Context.Set<TModel>();

        }

        private TModel Init(TSchema schema, TModel dest, TKey id)
        {

            if (id != null && Convert.ToInt32(id) > 0)
                dest = Get(id);
            else
                dest = new TModel();
            if (schema != null)
            {
                var destProps = dest.GetType().GetProperties().ToList();
                var sourceProps = schema.GetType().GetProperties().ToList();

                foreach (PropertyInfo sourceProp in sourceProps)
                {
                    //if (sourceProp.Name == "ID")
                    //    continue;
                    var destProp = destProps.Find(item => item.Name == sourceProp.Name);

                    if (destProp != null)
                    {
                        destProp.SetValue(dest, sourceProp.GetValue(schema, null), null);
                    }
                }
            }
            return dest;

        }
        public virtual TModel Add(TSchema schema, TModel item, TKey id)
        {
            item = Init(schema, item, id);
            Current.Add(item);

            Context.SaveChanges();

            return item;
        }
        public virtual List<TModel> AddRange(List<TModel> items)
        {
            Current.AddRange(items);

            Context.SaveChanges();

            return items;
        }

        public virtual TModel Update(TSchema schema, TModel item, TKey id)
        {
            item = Init(schema, item, id);
            //Context.Entry(item).State = EntityState.Modified;
            Context.SaveChanges();

            return item;
        }

        public virtual TModel Delete(TModel item)
        {
            Current.Remove(item);
            Context.SaveChanges();
            return item;
        }
        public virtual TModel Get(TKey id)
        {
            var key = GetKey();
            var body = key.Body;
            var exp = System.Linq.Expressions.Expression.Equal(body, System.Linq.Expressions.Expression.Constant(id));
            var lambda = System.Linq.Expressions.Expression.Lambda<Func<TModel, bool>>(exp, key.Parameters);

            return Current.FirstOrDefault(lambda);
        }

        public virtual IQueryable<TModel> All()
        {
            return Current;
        }

        public virtual IQueryable<TModel> All(int PageSize, int PageIndex)
        {
            return Current.OrderBy(GetKey()).Skip(PageSize * PageIndex).Take(PageSize);
        }

        public long Count()
        {
            return Current.LongCount();
        }

        public int Save()
        {
            return Context.SaveChanges();
        }

        public virtual List<TModel> DeleteRange(List<TModel> items)
        {
            foreach (var item in items)
                if (Context.Entry(item).State == EntityState.Detached)
                    Current.Attach(item);

            Current.RemoveRange(items);
            Context.SaveChanges();
            return items;

        }
    }
}